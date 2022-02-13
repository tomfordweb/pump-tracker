import Breadcrumb from "./breadcrumb";
import PageTitle from "./page-title";

interface Props {
  title: string;
  rightContent?: JSX.Element | JSX.Element[] | string | string[];
  textContent?: JSX.Element | JSX.Element[] | string | string[] | null;
}
const PageHeader = ({ title, rightContent, textContent }: Props) => {
  return (
    <header className="mb-5">
      <Breadcrumb />
      <div className="flex">
        <div className="grow">
          <PageTitle>{title}</PageTitle>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>
      {textContent && <div className="block mt-3 text-lg">{textContent}</div>}
    </header>
  );
};

export default PageHeader;
