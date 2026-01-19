type CheckboxProps = 
{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function checkBox ({ label, checked, onChange }: CheckboxProps)
{
    return (
        <>
        <div>
                <label className="inline-flex items-center justify-between w-full p-2 bg-[#0C2529] border-2 border-[#2C474B] rounded-lg cursor-pointer hover:bg-[#2C474B]">
                    <span className="ml-2 text-white font-bold">{label}</span>
                <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#98EAF3] bg-[#0C2529] border-gray-300 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                
            </label>
        </div>
        </>
    );
}