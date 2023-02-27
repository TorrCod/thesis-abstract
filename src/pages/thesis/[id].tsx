import Background from "@/components/background";
import { PriButton } from "@/components/button";
import Layout from "@/components/layout";
import Search from "@/components/search";
import { Divider } from "antd";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

type ThesisItems = {
  id: string;
  content: string;
};

const dummyData: ThesisItems[] = [
  { id: "hello", content: "Hello Content" },
  { id: "hi", content: "Hi Content" },
];

export const getStaticProps: GetStaticProps = async (context) => {
  const itemId = context.params?.id;
  const foundItem = dummyData.find((item) => itemId === item.id);
  if (!foundItem) {
    return {
      props: { hasError: true },
    };
  }
  return {
    props: { data: foundItem },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pathWithParams = dummyData.map((item) => ({ params: { id: item.id } }));

  return {
    paths: pathWithParams,
    fallback: true,
  };
};

const ThesisItemsView = (props: { data: ThesisItems; hasError: boolean }) => {
  const router = useRouter();
  if (props.hasError) {
    return <h1>Error - please try another parameter</h1>;
  }
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  return (
    <section className="flex flex-col gap-1 md:pt-20 items-center">
      <Search />
      <Divider />
      <div className="rs-container bg-slate-100 rounded-md max-w-5xl grid p-5 gap-2 md:gap-5 w-full relative">
        <div className="rs-preview p-5 bg-white shadow-md rounded-sm h-52 overflow-hidden text-[0.1em] relative max-w-[100em] text-justify justify-self-center">
          <div className="w-full h-full overflow-hidden">
            <h3 className="text-center">Abstract</h3>
            <p className="indent-3">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Molestias officiis quibusdam sequi non quam ipsam libero fugiat
              fugit optio aspernatur! Voluptatibus quisquam at unde, quas
              molestiae vitae quis dolorem esse. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Atque, nesciunt ea veritatis sint
              vitae numquam, exercitationem, blanditiis cum at nobis neque. Iste
              amet ut doloribus mollitia illum quos, inventore quaerat. Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Explicabo
              commodi consectetur asperiores eligendi, quo ex, minus velit
              possimus voluptatum dolor odit error necessitatibus at doloremque
              maiores recusandae, quos doloribus incidunt. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Porro beatae quibusdam quam
              illo soluta cupiditate amet! Illum omnis aperiam, distinctio
              eligendi ut modi quae dolore rerum, incidunt, ipsum maxime
              placeat. Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Tenetur, ratione dignissimos asperiores quod cupiditate cumque
              amet. Reprehenderit at ea, fugit nostrum, nesciunt quam nihil
              incidunt inventore pariatur natus, sunt quae? Lorem ipsum dolor
              sit, amet consectetur adipisicing elit. Eveniet, illum provident
              unde officia ipsam quis esse tempora cupiditate ullam voluptate
              ex, animi neque, quisquam repellendus sunt fugit. Voluptatibus,
              quas qui! lore
            </p>
          </div>
        </div>

        <div className="rs-details grid gap-2">
          <div>
            <span className="text-sm text-[#38649C]">Title</span>
            <h2>
              Thesis Abstract Thesis Abstract Management System for College of
              Engineering
            </h2>
          </div>
          <div>
            <span className="text-sm text-[#38649C]">Course</span>
            <h2>Computer Engineering</h2>
          </div>
          <div>
            <span className="text-sm text-[#38649C]">Date</span>
            <h2>01/01/2023</h2>
          </div>
        </div>

        <div className="rs-researchers">
          <span className="text-sm text-[#38649C]">Researchers</span>
          <div className="pl-5">
            <ul className="list-disc">
              <li>Christian Bert Torres</li>
              <li>Randyl Son Aradanas</li>
              <li>John Patrick Alcantara</li>
              <li>Ildefonso Mathew Perry Patena</li>
            </ul>
          </div>
        </div>

        <div className="rs-abstract justify-self-center text-justify leading-10">
          <div className="max-w-xl">
            <h3 className="text-center">Abstract</h3>
            <p className="indent-5">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Molestias officiis quibusdam sequi non quam ipsam libero fugiat
              fugit optio aspernatur! Voluptatibus quisquam at unde, quas
              molestiae vitae quis dolorem esse. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Atque, nesciunt ea veritatis sint
              vitae numquam, exercitationem, blanditiis cum at nobis neque. Iste
              amet ut doloribus mollitia illum quos, inventore quaerat. Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Explicabo
              commodi consectetur asperiores eligendi, quo ex, minus velit
              possimus voluptatum dolor odit error necessitatibus at doloremque
              maiores recusandae, quos doloribus incidunt. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Porro beatae quibusdam quam
              illo soluta cupiditate amet! Illum omnis aperiam, distinctio
              eligendi ut modi quae dolore rerum, incidunt, ipsum maxime
              placeat. Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Tenetur, ratione dignissimos asperiores quod cupiditate cumque
              amet. Reprehenderit at ea, fugit nostrum, nesciunt quam nihil
              incidunt inventore pariatur natus, sunt quae? Lorem ipsum dolor
              sit, amet consectetur adipisicing elit. Eveniet, illum provident
              unde officia ipsam quis esse tempora cupiditate ullam voluptate
              ex, animi neque, quisquam repellendus sunt fugit. Voluptatibus,
              quas qui! Lorem, ipsum dolor sit amet consectetur adipisicing
              elit. Excepturi alias aliquid veniam porro nihil distinctio!
              Dolor, autem provident odio numquam, consequatur et minus ut
              mollitia eum fuga, fugit possimus quis! Lorem ipsum, dolor sit
              amet consectetur adipisicing elit. Animi culpa incidunt cum
              placeat facilis laboriosam cupiditate tempore aliquid vitae! Odit
              ipsum labore necessitatibus officia soluta aliquid obcaecati quo
              assumenda fuga? amet consectetur adipisicing elit. Porro beatae
            </p>
          </div>
        </div>
        <div className="rs-button grid place-items-end md:place-items-start">
          <Divider />
          <PriButton>Download</PriButton>
        </div>
      </div>
    </section>
  );
};

export default ThesisItemsView;
