import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchAllCompanies } from '../../ReduxToolkit/CompanySlice';
import CompanyCard from './CompanyCard';
import { fetchAllJobs } from '../../ReduxToolkit/JobSlice';

const CompanyList = () => {
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  const companies = useSelector((store) => store.company.companies);
  const loading = useSelector((store) => store.company.loading);
  const error = useSelector((store) => store.company.error);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterValue = queryParams.get('filter');

  useEffect(() => {
    if (
      auth.user?.role === 'ROLE_ADMIN' ||
      auth.user?.role === 'ROLE_APPLICANT'
    ) {
      dispatch(fetchAllCompanies());
      dispatch(fetchAllJobs());
    }
  }, [dispatch, filterValue, auth.user?.role]);

  return (
    <div className="space-y-3 w-full max-w-full px-4">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {companies.length > 0
        ? companies.map((company) => (
            <CompanyCard
              key={company.id}
              item={company}
              disableCompanyList={true}
            />
          ))
        : !loading && <p>No companies found.</p>}
    </div>
  );
};

export default CompanyList;
