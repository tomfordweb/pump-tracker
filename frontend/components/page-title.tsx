const PageTitle = ({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string | string[];
}) => <h1 className="text-xl">{children}</h1>;

export default PageTitle;
