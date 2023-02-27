import { PriButton } from "@/components/button";
import Search from "@/components/search";
import { Divider } from "antd";

const Thesis = () => {
  return (
    <>
      <main className="md:mt-20 md:flex md:place-items-center md:flex-col">
        <div className="grid w-full">
          <Search className="max-w-[30em] place-self-center w-full my-5" />
          <Divider className="bg-white/30" />
        </div>
        <div className="grid gap-2 w-full place-items-center lg:grid-cols-2">
          <Items />
          <Items />
          <Items />
          <Items />
          <Items />
          <Items />
        </div>
      </main>
    </>
  );
};

const Items = () => {
  return (
    <div className="thesis_items w-full bg-slate-100 md:h-82 h-auto max-w-[50em] shadow-md rounded-md p-5 gap-2 md:gap-5 grid">
      <div className="div2 flex flex-col md:py-5 md:gap-5 gap-2">
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
      <div className="div3 md:p-5 px-5">
        <div>
          <span className="text-sm text-[#38649C]">Researchers</span>
          <ul className="list-disc">
            <li>Christian Bert Torres</li>
            <li>Randyl Son Aradanas</li>
            <li>John Patrick Alcantara</li>
            <li>Ildefonso Mathew Perry Patena</li>
          </ul>
        </div>
      </div>

      <div className="div1 p-5 bg-white shadow-md rounded-sm max-w-xs min-h-[25em] max-h-[25em]  md:max-w-md md:min-h-0 md:h-[18em] place-self-center w-full overflow-hidden">
        <h4 className="text-center text-xs  md:text-[0.5vw]">Abstract</h4>
        <p className="indent-5 text-justify text-xs leading-6 md:text-[0.5vw]">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias
          officiis quibusdam sequi non quam ipsam libero fugiat fugit optio
          aspernatur! Voluptatibus quisquam at unde, quas molestiae vitae quis
          dolorem esse. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Atque, nesciunt ea veritatis sint vitae numquam, exercitationem,
          blanditiis cum at nobis neque. Iste amet ut doloribus mollitia illum
          quos, inventore quaerat. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Explicabo commodi consectetur asperiores eligendi,
          quo ex, minus velit possimus voluptatum dolor odit error
          necessitatibus at doloremque maiores recusandae, quos doloribus
          incidunt. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Porro beatae quibusdam quam illo soluta cupiditate amet! Illum omnis
          aperiam, distinctio eligendi ut modi quae dolore rerum, incidunt,
          ipsum maxime placeat. Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Tenetur, ratione dignissimos asperiores quod
          cupiditate cumque amet. Reprehenderit at ea, fugit nostrum, nesciunt
          quam nihil incidunt inventore pariatur natus, sunt quae? Lorem ipsum
          dolor sit, amet consectetur adipisicing elit. Eveniet, illum provident
          unde officia ipsam quis esse tempora cupiditate ullam voluptate ex,
          animi neque, quisquam repellendus sunt fugit. Voluptatibus, quas qui!
        </p>
      </div>
      <div className="div4 grid place-items-end">
        <PriButton>Download</PriButton>
      </div>
    </div>
  );
};

export default Thesis;
