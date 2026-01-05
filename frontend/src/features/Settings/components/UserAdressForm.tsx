import useIsMobile from "../../../components/layouts/UseIsMobile";

type Address = {
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
};

type UserAdressFormProps = {
  initialData?: Address;
};

export default function UserAdressForm ({ initialData }: UserAdressFormProps) {
    const isMobile = useIsMobile();
    return (
    <div className="w-full p-4">
      <div className="border-b-2 border-b-[#4A6367] flex justify-between gap-20 items-center w-full h-30 px-2 py-5 pb-2">
        <p className="w-60 font-semibold">N° et nom de rue</p>
        <input
          type="text"
          defaultValue={initialData?.street ?? ""}
          className={`w-full bg-[#2C474B] ${
            isMobile ? "min-w-40 max-w-60" : ""
          } h-15 p-4 rounded-xl`}
        />
      </div>

      <div className="border-b-2 border-b-[#4A6367] flex justify-between gap-20 items-center w-full h-30 px-2 py-5 pb-2">
        <p className="w-60 font-semibold">Code postal</p>
        <input
          type="text"
          defaultValue={initialData?.zipCode ?? ""}
          className={`w-full bg-[#2C474B] ${
            isMobile ? "min-w-40 max-w-60" : ""
          } h-15 p-4 rounded-xl`}
        />
      </div>

      <div className="border-b-2 border-b-[#4A6367] flex justify-between gap-18 items-center w-full h-30 px-2 py-5 pb-2">
        <p className="w-60 font-semibold">Ville</p>
        <input
          type="text"
          defaultValue={initialData?.city ?? ""}
          className={`w-full bg-[#2C474B] ${
            isMobile ? "min-w-34 max-w-60" : ""
          } h-15 p-4 rounded-xl`}
        />
      </div>

      <div className="flex justify-between gap-20 items-center w-full h-30 px-2 py-5 pb-2">
        <p className="w-60 font-semibold">Pays</p>
        <input
          type="text"
          defaultValue={initialData?.country ?? ""}
          className={`w-full bg-[#2C474B] ${
            isMobile ? "min-w-40 max-w-60" : ""
          } h-15 p-4 rounded-xl`}
        />
      </div>
    </div>
  );
}