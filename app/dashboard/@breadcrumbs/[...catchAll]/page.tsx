import { Breadcrumbs } from "../../components/Breadcrumbs";
type Props = {
  params: {
    catchAll: string[];
  };
};
export default async function BreadcrumbsSlot({ params }: Props) {
  const { catchAll } = await params; // Await params before accessing its properties
  return <Breadcrumbs routes={catchAll} />;
}
