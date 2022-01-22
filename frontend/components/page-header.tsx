import Breadcrumb from "./breadcrumb";
import PageTitle from "./page-title";

interface Props {
  title: string;
  rightContent?: JSX.Element | JSX.Element[] | string | string[];
}
const PageHeader = ({ title, rightContent }: Props) => {
  return (
    <header className="mb-5">
      <Breadcrumb />
      <div className="flex">
        <div className="grow">
          <PageTitle>{title}</PageTitle>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>
    </header>
  );
};

export default PageHeader;
