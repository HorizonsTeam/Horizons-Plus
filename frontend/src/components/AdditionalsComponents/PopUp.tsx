import { type Dispatch, type SetStateAction, type ReactNode } from "react";
import useIsMobile from "../layouts/UseIsMobile";
import CheckMarkSVG from "../../assets/checkMarck.svg";
import { Loader } from "lucide-react";

type PopupProps = {
  message: string | null;
  Btn?: ReactNode;
  setPopupIsDisplayed?: Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
  isLoadingMsg?:string;
  isSuccess?: boolean;
};

export default function PopUp({
  message,
  Btn,
  setPopupIsDisplayed,
  isLoading,
  isLoadingMsg,
  isSuccess,
}: PopupProps) {
  const isMobile = useIsMobile();

  const close = () => setPopupIsDisplayed?.(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#103035]/50"
      onClick={close}
    >
      <div
        className={`bg-[#2C474B] p-6 mx-5 rounded-2xl ${
          isMobile ? "w-80" : "w-[28rem]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid gap-10">
          {isLoading ? (
            <>
            <div className="flex justify-center">
              <Loader className="animate-spin text-white" size={40} />
              
            </div>
            <p>{isLoadingMsg}</p>
            </>
          ) : (
            <div className="grid gap-5">
              {isSuccess && (
                <div className="flex items-center justify-center w-15 h-15 mx-auto">
                  <img src={CheckMarkSVG} alt="" />
                </div>
              )}

              <p className={`text-center font-semibold ${isMobile ? "text-sm" : "text-xl"}`}>
                {message}
              </p>

              <div className="flex justify-between w-full">{Btn}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
