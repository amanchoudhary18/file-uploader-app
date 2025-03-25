import { FaChevronRight } from "react-icons/fa";

const Breadcrumbs = ({ breadcrumbs, parentId, onClick }) => {
  return (
    <div className="flex items-center space-x-2 text-sm px-5 py-2 ">
      {breadcrumbs.length > 1 &&
        breadcrumbs.map((crumb, index) => (
          <span key={crumb.id} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">
                <FaChevronRight size={14} />
              </span>
            )}

            <p
              className={`py-1 rounded-lg transition-all duration-300 font-medium ${
                crumb.id === parentId
                  ? "text-black"
                  : "text-slate-400 hover:text-black hover:underline"
              }`}
              role="button"
              onClick={() => onClick(crumb)}
            >
              {crumb.name}
            </p>
          </span>
        ))}
    </div>
  );
};

export default Breadcrumbs;
