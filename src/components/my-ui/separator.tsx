export const Separator = ({ text }: { text?: string }) => (
  <div className="flex">
    <div className="relative flex-1">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-foreground" />
      </div>
    </div>
    {text && <p className="px-2 text-xs uppercase">{text}</p>}
    <div className="relative flex-1">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-foreground" />
      </div>
    </div>
  </div>
);
