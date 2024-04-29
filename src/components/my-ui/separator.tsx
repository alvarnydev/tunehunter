import clsx from "clsx";

export const Separator = ({ borderColor, text }: { borderColor: string; text?: string }) => (
  <div className="flex w-full">
    <div className="relative flex-1">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <span className={clsx("w-full border-t", borderColor)} />
      </div>
    </div>
    {text && <p className="px-2 text-xs uppercase">{text}</p>}
    <div className="relative flex-1">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <span className={clsx("w-full border-t", borderColor)} />
      </div>
    </div>
  </div>
);
