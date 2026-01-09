import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

type OptionSelectorProps = {
    options?: string[];
    Placeholder?: string;
    Onchange: (option: string) => void | React.Dispatch<React.SetStateAction<string>>;
};

export default function SelectPlaceholder({ options, Placeholder, Onchange }: OptionSelectorProps) {
    const [option, setOption] = React.useState<string>("");

    const handleChange = (event: SelectChangeEvent<string>) => {
        setOption(event.target.value);
        if (Onchange) {
            Onchange(event.target.value);
        }
    };

    return (
        <div className="px-2">
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                <Select
                    displayEmpty
                    value={option}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) =>
                        selected === "" ? <em>{Placeholder}</em> : selected
                    }
                    MenuProps={MenuProps}
                    sx={{
                        color: "white",
                        backgroundColor: "#0C2529",
                        borderRadius: "12px",
                        ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255,255,255,0.15)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255,255,255,0.35)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#98EAF3",
                        },
                        ".MuiSelect-icon": { color: "rgba(255,255,255,0.7)" },
                    }}
                >
                    <MenuItem disabled value="">
                        <em>{Placeholder}</em>
                    </MenuItem>

                    {options?.map((opt) => (
                        <MenuItem
                            key={opt}
                            value={opt}
                            sx={{ bgcolor: "white", "&:hover": { bgcolor: "#f3f4f6" } }}
                        >
                            {opt}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
