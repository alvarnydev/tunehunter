"use client";

import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div className="w-fit">
      <button className="flex items-center shadow-primary drop-shadow-xl" onClick={handleClick}>
        <h1 className="text-5xl">Tune</h1>
        <h1 className="text-5xl text-primary">Hunter</h1>
      </button>
    </div>
  );
};

export default Header;
