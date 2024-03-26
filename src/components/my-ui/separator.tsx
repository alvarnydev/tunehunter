export const Separator = ({ text }: { text?: string }) => (
  // <div className="relative">
  //   <div aria-hidden="true" className="absolute inset-0 flex items-center">
  //     <span className="w-full border-t border-foreground" />
  //   </div>
  //   {text && (
  //     <div className="relative flex justify-center text-xs uppercase">
  //       <span className=" px-2 text-foreground">{text}</span>
  //     </div>
  //   )}
  // </div>
  <div className="flex">
    <div className="relative flex-1">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-foreground" />
      </div>
    </div>
    {text && <p className="px-2 uppercase text-xs">{text}</p>}
    <div className="relative flex-1">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-foreground" />
      </div>
    </div>
  </div>
);
