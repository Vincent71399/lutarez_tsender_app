import { isAddress } from 'viem/utils'
import { zeroAddress } from 'viem'

function normalizeAddress(address: string): string {
    if (!address.startsWith("0x")) return "0x" + address;
    return address;
}

export function validateSingleAddress(input: string): {msg:string, address:string} {
    if(input.length === 0){
        return { msg:"", address: ""}
    }

    input = normalizeAddress(input.trim())
    if(isAddress(input)){
        if(input.toLowerCase() === zeroAddress){
            return { msg:"Zero address is not allowed", address: ""}
        }
        return { msg: "", address: input }
    }else{
        return { msg: "Invalid address format", address: ""}
    }
}

export function validateMultipleAddresses(input: string): {msg:string, addresses:string[]} {
    if(input.length === 0){
        return { msg:"", addresses: [] }
    }

    const rawItems = input.split(/[\n,]/)
    const cleanedAddresses = rawItems
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .map(normalizeAddress);

    // Check for invalid or zero addresses
    for (const address of cleanedAddresses) {
        if (!isAddress(address)) {
            return { msg: "Invalid addresses format", addresses: [] };
        }else if(address.toLowerCase() === zeroAddress) {
            return { msg: "Zero address is not allowed", addresses: [] };
        }
    }

    // Check for duplication
    const lowerCased = cleanedAddresses.map(addr => addr.toLowerCase());
    const uniqueSet = new Set(lowerCased);
    if (uniqueSet.size !== lowerCased.length) {
        return { msg: "Duplicate addresses found", addresses: [] };
    }

    if( cleanedAddresses.length === 0 ) {
        return { msg: "No valid addresses provided", addresses: [] };
    }

    return { msg: "", addresses: cleanedAddresses };
}

export function validateAmounts(input: string): {msg:string, amounts:number[], total:number} {
    if(input.length === 0){
        return { msg:"", amounts: [],  total: 0 }
    }

    const amountArray = input
        .split(/[,\n]+/)
        .map(amt => amt.trim())
        .filter(amt => amt !== "")
        .map(amt => parseFloat(amt))
    if (amountArray.some(isNaN)) {
        return { msg: "Invalid amount format", amounts: [], total: 0 };
    }
    if (amountArray.some(amt => amt <= 0)) {
        return { msg: "Amounts must be greater than zero", amounts: [], total: 0 };
    }

    if (amountArray.length === 0) {
        return { msg: "No valid amounts provided", amounts: [], total: 0 };
    }

    return { msg: "", amounts: amountArray, total: amountArray.reduce((acc, curr) => acc + curr, 0) };
}

export function validateSubmit(
    tokenAddressBundle: {msg:string, address:string},
    recipientsBundle: {msg:string, addresses:string[]},
    amountsBundle: {msg:string, amounts:number[], total:number}
): {msg:string, isValid:boolean} {
    if( tokenAddressBundle.msg === "" && recipientsBundle.msg === "" && amountsBundle.msg === "" && amountsBundle.total > 0 ) {
        if( tokenAddressBundle.address !== "" &&
            recipientsBundle.addresses.length > 0 &&
            amountsBundle.amounts.length > 0 &&
            amountsBundle.total > 0 ) {
            if( recipientsBundle.addresses.length !== amountsBundle.amounts.length ) {
                return {msg: "Number of recipients and amounts must match", isValid: false};
            }else {
                return {msg: "", isValid: true};
            }
        }
    }
    return {msg: "", isValid: false};
}