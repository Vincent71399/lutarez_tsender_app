import React from "react";

type SummaryTableProps = {
    tokenAddress: string;
    recipients: string[];
    amounts: number[];
    total?: number;
};

export const SummaryTable: React.FC<SummaryTableProps> = ({
                                                                 tokenAddress,
                                                                 recipients,
                                                                 amounts,
                                                                 total
                                                             }) => {
    return (
        <div className="w-full max-w-2xl mx-auto my-6 bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-4">
                <span className="font-semibold text-gray-700 text-lg">Token Address:</span>
                <span className="ml-2 font-mono text-blue-700 break-all">{tokenAddress}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Recipient</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recipients.map((recipient, i) => (
                        <tr key={recipient + i} className="odd:bg-white even:bg-gray-200">
                            <td className="px-4 py-2 font-mono text-sm break-all">{recipient}</td>
                            <td className="px-4 py-2">{amounts[i]}</td>
                        </tr>
                    ))}
                    <tr className="border-t odd:bg-white even:bg-gray-200">
                        <td className="px-4 py-2 font-mono text-sm break-all">Total</td>
                        <td className="px-4 py-2">{total}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SummaryTable;
