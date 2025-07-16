import React from "react";

const Spinner = () => {
    return (
        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
        </svg>
    );
}

type ButtonWithSpinnerProps = {
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    text?: string;
}

export const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
    onClick,
    loading = false,
    disabled = false,
    text = "Submit",
})=> {
    return (
        <button
            className={`relative w-1/3 flex items-center justify-center font-bold py-2 px-8 rounded-2xl shadow-sm text-lg focus:outline-none focus:ring-2 transition duration-150 ease-in-out
            ${disabled
                ? "bg-gray-400 text-gray-200 cursor-not-allowed focus:ring-gray-300"
                : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300"
             }`
            }
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading && (
                <span className="absolute left-4 flex items-center">
                  <Spinner />
                </span>
            )}
            {text}
        </button>
    );
}