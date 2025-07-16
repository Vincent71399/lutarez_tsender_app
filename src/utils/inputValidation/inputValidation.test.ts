import { describe, it, expect } from "vitest"
import { validateSingleAddress, validateMultipleAddresses, validateAmounts, validateSubmit } from "./inputValidation"

describe("inputValidation", () => {
    // validateSingleAddress
    it("address is valid", () => {
        const addressString = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        const result = validateSingleAddress(addressString)
        expect(result.msg).toBe("")
        expect(result.address).toBe("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    })

    it("address is zero address", () => {
        const addressString = "0x0000000000000000000000000000000000000000"
        const result = validateSingleAddress(addressString)
        expect(result.msg).toBe("Zero address is not allowed")
        expect(result.address).toBe("")
    })

    it("address miss 0x", () => {
        const addressString = "f39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        const result = validateSingleAddress(addressString)
        expect(result.msg).toBe("")
        expect(result.address).toBe("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    })

    // validateMultipleAddresses
    it("multiple address single is valid", () => {
        const addressString = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        const result = validateSingleAddress(addressString)
        expect(result.msg).toBe("")
        expect(result.address).toBe("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    })

    it("multiple addresses are valid", () => {
        const addressString = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        const result = validateMultipleAddresses(addressString)
        expect(result.msg).toBe("")
        expect(result.addresses.length).toBe(3)
    })

    it("multiple addresses with newline are valid", () => {
        const addressString = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \n0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \n 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        const result = validateMultipleAddresses(addressString)
        expect(result.msg).toBe("")
        expect(result.addresses.length).toBe(3)
    })

    it("multiple addresses with invalid address", () => {
        const addressString = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 100, def"
        const result = validateMultipleAddresses(addressString)
        expect(result.msg).toBe("Invalid addresses format")
        expect(result.addresses.length).toBe(0)
    })

    it("multiple addresses with zero address", () => {
        const addressString = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 0x0000000000000000000000000000000000000000"
        const result = validateMultipleAddresses(addressString)
        expect(result.msg).toBe("Zero address is not allowed")
        expect(result.addresses.length).toBe(0)
    })

    it("multiple addresses with empty string", () => {
        const addressString = ""
        const result = validateMultipleAddresses(addressString)
        expect(result.msg).toBe("")
        expect(result.addresses.length).toBe(0)
    })

    it("multiple addresses with trailing comma", () => {
        const addressString = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 0x70997970C51812dc3A010C7d01b50e0d17dc79C8, "
        const result = validateMultipleAddresses(addressString)
        expect(result.msg).toBe("")
        expect(result.addresses.length).toBe(2)
    })

    it("multiple addresses missing 0x", () => {
        const addressString = "f39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 70997970C51812dc3A010C7d01b50e0d17dc79C8"
        const result = validateMultipleAddresses(addressString)
        expect(result.msg).toBe("")
        expect(result.addresses.length).toBe(2)
        expect(result.addresses[0]).toBe("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
        expect(result.addresses[1]).toBe("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    })

    it("multiple addresses with duplicates", () => {
        const addressString = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        const result = validateMultipleAddresses(addressString)
        expect(result.msg).toBe("Duplicate addresses found")
        expect(result.addresses.length).toBe(0)
    })

    // validateAmounts
    it("valid amounts", () => {
        const amountString = "100,200,300"
        const result = validateAmounts(amountString)
        expect(result.msg).toBe("")
        expect(result.amounts.length).toBe(3)
        expect(result.total).toBe(600)
    })

    it("valid amounts with whitespace", () => {
        const amountString = "100, 200, 300"
        const result = validateAmounts(amountString)
        expect(result.msg).toBe("")
        expect(result.amounts.length).toBe(3)
        expect(result.total).toBe(600)
    })

    it("empty amounts", () => {
        const amountString = ""
        const result = validateAmounts(amountString)
        expect(result.msg).toBe("")
        expect(result.amounts.length).toBe(0)
        expect(result.total).toBe(0)
    })

    it("invalid amounts", () => {
        const amountString = "abc,100,def"
        const result = validateAmounts(amountString)
        expect(result.msg).toBe("Invalid amount format")
        expect(result.amounts.length).toBe(0)
        expect(result.total).toBe(0)
    })

    it("amounts with trailing comma", () => {
        const amountString = "100,200,"
        const result = validateAmounts(amountString)
        expect(result.msg).toBe("")
        expect(result.amounts.length).toBe(2)
        expect(result.total).toBe(300)
    })
    // validateSubmit
    it("valid submit", () => {
        const tokenAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        const recipients = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        const amounts = "100,200"
        const result = validateSubmit(
            validateSingleAddress(tokenAddress),
            validateMultipleAddresses(recipients),
            validateAmounts(amounts)
        )
        expect(result.msg).toBe("")
        expect(result.isValid).toBe(true)
    })

    it("invalid submit - different number of recipients and amounts", () => {
        const tokenAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        const recipients = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        const amounts = "100,200,300" // 3 amounts but only 2 recipients
        const result = validateSubmit(
            validateSingleAddress(tokenAddress),
            validateMultipleAddresses(recipients),
            validateAmounts(amounts)
        )
        expect(result.msg).toBe("Number of recipients and amounts must match")
        expect(result.isValid).toBe(false)
    })
    it("invalid submit - invalid input", () => {
        const tokenAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        const recipients = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        const amounts = "100,abc" // 3 amounts but only 2 recipients
        const result = validateSubmit(
            validateSingleAddress(tokenAddress),
            validateMultipleAddresses(recipients),
            validateAmounts(amounts)
        )
        expect(result.msg).toBe("")
        expect(result.isValid).toBe(false)
    })
})