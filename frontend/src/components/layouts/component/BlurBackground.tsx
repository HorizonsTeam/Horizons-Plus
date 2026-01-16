type BlurBackgroundProps = {
    closeFocus: () => void
};

export default function BlurBackground({closeFocus}: BlurBackgroundProps) {

    return (
        <div
            className="fixed inset-0 z-[9000] flex justify-center items-center py-8"
            onMouseDown={closeFocus}
            style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                backgroundColor: "rgba(0,0,0,0.35)",
            }}
        />
    );
}
