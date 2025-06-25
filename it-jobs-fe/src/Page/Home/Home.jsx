import CompanyList from '../Company/CompanyList';
import Sidebar from '../Sidebar/Sidebar';

const Home = () => {
  return (
    <div className="lg:flex px-5 lg:px-20 pt-[2.9vh] min-h-screen">
      <div className="hidden lg:block w-[25vw]">
        <Sidebar />
      </div>
      <div className="max-w-[1300px] w-full mx-auto px-4">
        <CompanyList />
      </div>
    </div>
  );
};

export default Home;
