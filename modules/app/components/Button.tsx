import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  secondary?: boolean;
  fullWidth?: boolean;
};

function Button({
  children,
  onClick = () => null,
  secondary,
  disabled,
  fullWidth
}: Props) {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`std-btn ${secondary ? "secondary" : ""}`}
      >
        {children}
      </button>
      <style jsx>
        {`
          .std-btn {
            border: 1px solid rgba(183, 168, 168, 0.35);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            border-radius: 30px;
            padding: 0.75em 2.5em;
            background-color: var(--primary);
            color: white;
            font-weight: bold;
            font-size: 0.9rem;
            transition: all 150ms;
            opacity: ${disabled ? "60%" : "100%"};
            margin-right: 1em;
            width: ${fullWidth ? '100%': 'auto'};
          }

          .std-btn.secondary {
            background-color: var(--secondary);
            color: var(--alt-secondary);
          }

          .std-btn:hover {
            transform: ${disabled ? "": "scale(1.05)"};
            cursor: ${disabled ? "not-allowed" : "pointer"};
          }

          .std-btn:active {
            transform: scale(0.95);
          }
        `}
      </style>
    </>
  );
}

export default Button;
