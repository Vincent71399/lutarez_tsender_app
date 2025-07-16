import React from "react";

type InputFieldProps = {
    label: string;
    placeholder?: string;
    value: string;
    type?: React.HTMLInputTypeAttribute;
    large?: boolean;
    onChange: (value: string) => void;
    alertText?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
                                                          label,
                                                          placeholder = "",
                                                          value,
                                                          type = "text",
                                                          large = false,
                                                          onChange,
                                                          alertText = "", // <-- Add this line
                                                      }) => {
    const borderClass = alertText !== ""
        ? "border-red-500 focus:ring-red-400"
        : "border-gray-300 focus:ring-blue-400";

    return (
        <div className="flex flex-col items-start w-full mb-4">
            <label className="min-w-[120px] text-shadow-md font-medium text-gray-700 pt-2 pr-4 mb-2">
                {label}
            </label>
            {large ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`border rounded-md focus:outline-none transition px-3 resize-none w-full py-2 text-base min-h-[60px] shadow-md ${borderClass}`}
                    rows={4}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`border rounded-md focus:outline-none transition px-3 w-full py-2 text-base shadow-md ${borderClass}`}
                />
            )}
            {/* Alert text */}
            {alertText && (
                <div className="text-red-600 text-sm mt-1">{alertText}</div>
            )}
        </div>
    );
};