interface ISwitch {
    checked: boolean;
    onChange: (bool: boolean) => void;
    disabled: boolean;
}

export default function Switch({
    checked,
    onChange,
    disabled = false,
}: ISwitch) {
    console.log(checked);
    return (
        <label className="switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange(!checked)}
                disabled={disabled}
            />
            <span className="slider round" />

            <style jsx>{`
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 25px;
                    opacity: ${disabled ? 0.6 : 1};
                }

                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    -webkit-transition: 0.4s;
                    transition: 0.4s;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 17px;
                    width: 17px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    -webkit-transition: 0.4s;
                    transition: 0.4s;
                }

                .slider:hover {
                    cursor: ${disabled ? "not-allowed" : "pointer"};
                }

                input:checked + .slider {
                    background-color: #1aab9b;
                }

                input:focus + .slider {
                    box-shadow: 0 0 0 1px black;
                }

                input:checked + .slider:before {
                    -webkit-transform: translateX(16px);
                    -ms-transform: translateX(16px);
                    transform: translateX(16px);
                }

                .slider.round {
                    border-radius: 34px;
                }

                .slider.round:before {
                    border-radius: 50%;
                }
            `}</style>
        </label>
    );
}
