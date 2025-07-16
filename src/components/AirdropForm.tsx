"use client"

import React, { useState, useEffect, useMemo } from "react";
import { InputField } from "@/components/ui/InputField";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/utils/constants";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { ButtonWithSpinner} from "@/components/ui/ButtonWithSpinner";
import { SummaryTable } from "@/components/ui/SummaryTable";
import { validateSingleAddress, validateMultipleAddresses, validateAmounts, validateSubmit } from "@/utils/inputValidation/inputValidation";


export default function AirdropForm(){
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    // save local state for the input fields
    useEffect(() => {
        const savedTokenAddress = localStorage.getItem('tokenAddress')
        const savedRecipients = localStorage.getItem('recipients')
        const savedAmounts = localStorage.getItem('amounts')

        if (savedTokenAddress) setTokenAddress(savedTokenAddress)
        if (savedRecipients) setRecipients(savedRecipients)
        if (savedAmounts) setAmounts(savedAmounts)
    }, [])

    useEffect(() => {
        localStorage.setItem('tokenAddress', tokenAddress)
    }, [tokenAddress])

    useEffect(() => {
        localStorage.setItem('recipients', recipients)
    }, [recipients])

    useEffect(() => {
        localStorage.setItem('amounts', amounts)
    }, [amounts])

    // wagmi
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();

    const { isPending, writeContractAsync } = useWriteContract();

    const tokenAddressBundle: {msg:string, address:string} = useMemo(() => validateSingleAddress(tokenAddress), [tokenAddress])
    const recipientsBundle: {msg:string, addresses:string[]} = useMemo(() => validateMultipleAddresses(recipients), [recipients])
    const amountsBundle: {msg:string, amounts:number[], total:number} = useMemo(() => validateAmounts(amounts), [amounts])
    const total: number = amountsBundle.total
    const enableSubmit: {msg:string, isValid: boolean} = validateSubmit(tokenAddressBundle, recipientsBundle, amountsBundle)
    const buttonText = isPending ? "Processing..." : "Submit";

    async function handleSubmit() {
        if(!account.isConnected){
            alert("Please connect your account first")
            return
        }
        const tSenderAddress = chainsToTSender[chainId]["tsender"];
        // 1a. If already approved, skip step 1
        const approveAmount = Number(await getApprovedAmount(tSenderAddress));
        if(total == 0){
            alert("Please enter valid amounts")
            return
        }else{
            console.log("total : ", total)
            console.log("approveAmount : ", approveAmount)
            if (approveAmount < total) {
                // 1. approve tsender contract to send our tokens
                const approvalHash = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: "approve",
                    args: [tSenderAddress as `0x${string}`, BigInt(total)],
                })
                const approvalReceipt = await waitForTransactionReceipt(config, {
                    hash: approvalHash,
                })
                console.log("Approval confirmed:", approvalReceipt)

                // 2. call the airdrop function on the tsender contract
                await writeContractAsync({
                    abi: tsenderAbi,
                    address: tSenderAddress as `0x${string}`,
                    functionName: "airdropERC20",
                    args: [
                        tokenAddress,
                        // Comma or new line separated
                        recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                        amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                        BigInt(total),
                    ],
                })
            }else{
                // 2. call the airdrop function on the tsender contract
                await writeContractAsync({
                    abi: tsenderAbi,
                    address: tSenderAddress as `0x${string}`,
                    functionName: "airdropERC20",
                    args: [
                        tokenAddress,
                        // Comma or new line separated
                        recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                        amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                        BigInt(total),
                    ],
                })
            }
            // console.log("next step")
        }

        // 3. wait for the transaction to be mined
    }



    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("This chain only has the safer version!")
            return 0
        }
        // read the approved amount from the token contract
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`],
        })
        return response as number
    }

    return <div className="p-6">
            <div className="space-y-6 flex flex-col items-center justify-center">
            <InputField
                label="Token Address"
                placeholder="Enter token address"
                value={tokenAddress}
                large={false}
                onChange={setTokenAddress}
                alertText={tokenAddressBundle.msg}
            />

            <InputField
                label="Recipient Address (comma or newline separated)"
                placeholder="0x123..., 0x456..."
                value={recipients}
                large={true}
                onChange={setRecipients}
                alertText={recipientsBundle.msg}
            />

            <InputField
                label="Amounts (wei; comma or newline separated)"
                placeholder="100, 200, 300"
                value={amounts}
                large={true}
                onChange={setAmounts}
                alertText={amountsBundle.msg}
            />
            {enableSubmit.msg && (
                <div className="text-red-600 text-sm mt-1">{enableSubmit.msg}</div>
            )}
            <SummaryTable
                tokenAddress={tokenAddressBundle.address}
                recipients={recipientsBundle.addresses}
                amounts={amountsBundle.amounts}
                total={amountsBundle.total}
            />
            <ButtonWithSpinner disabled={!enableSubmit.isValid} loading={isPending} text={buttonText} onClick={handleSubmit} />
        </div>
    </div>
}

