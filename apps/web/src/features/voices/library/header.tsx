const Header = ({ totalCount }: { totalCount: number }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Voice Library</h1>
      <p className="text-sm text-muted-foreground">
        Browse {totalCount > 0 ? `${totalCount} public` : "public"} voices ready to use
      </p>
    </div>
  );
};

export default Header;
