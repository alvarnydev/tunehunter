"use client";

import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-fit">
        <button className="flex items-center shadow-primary drop-shadow-xl" onClick={handleClick}>
          <h1 className="text-5xl">Tune</h1>
          <h1 className="text-5xl text-primary">Hunter</h1>
        </button>
      </div>
      {/* <p className="text-md italic text-muted-foreground">
        The easy way to buy club mixes of your favorite tunes!
      </p> */}
    </div>
  );
};

export default Header;
