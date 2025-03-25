import React, { useContext, useEffect, useState } from "react";
import Button from "./Button";
import { VscNewFolder } from "react-icons/vsc";
import Folder from "./Folder";
import File from "./File";
import axios from "axios";
import { getFileCategory } from "../utils/getFileCategory";
import { toast } from "react-toastify";
import FilePreview from "./FilePreview";
import Breadcrumbs from "./Breadcrumbs";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader";
import NewFolderModal from "./NewFolderModal";

const CloudStorage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [breadcrumbs, setBreadcrumbsState] = useState(() => {
    const savedBreadcrumbs = localStorage.getItem("breadcrumbs");
    return savedBreadcrumbs
      ? JSON.parse(savedBreadcrumbs)
      : [{ name: "Home", id: null }];
  });

  const setBreadcrumbs = (newBreadcrumbs) => {
    setBreadcrumbsState(newBreadcrumbs);
    localStorage.setItem("breadcrumbs", JSON.stringify(newBreadcrumbs));
  };

  const { parentId, setParentId, storage, setStorage } =
    useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loader, setLoader] = useState(false);

  const fetchFolderContents = async (parentId = null) => {
    setLoader(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/folder/${
          parentId ? "?parentId=" + parentId : ""
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStorage(data);
    } catch (error) {
      toast.error("Failed to load cloud storage.");
    } finally {
      setLoader(false);
    }
  };

  const handleFolderClick = (folder) => {
    setStorage(null);
    setParentId(folder._id);
    setBreadcrumbs([...breadcrumbs, { name: folder.name, id: folder._id }]);
    fetchFolderContents(folder._id);
  };

  const handleFileClick = async (file) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: Please log in.");
        return;
      }

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/file/download/${file._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!data.downloadUrl) {
        throw new Error("Download URL not found.");
      }

      if (file.type.startsWith("image/")) {
        setSelectedFile({ ...file, url: data.downloadUrl });
      } else if (
        file.type.startsWith("text/") ||
        file.type === "application/json"
      ) {
        const fileResponse = await axios.get(data.downloadUrl);
        setSelectedFile({
          ...file,
          url: data.downloadUrl,
          content: fileResponse.data,
        });
      }
    } catch (error) {
      toast.error("Failed to open file. Please try again.");
    }
  };

  const handleFolderCreated = (newFolder) => {
    setStorage((prev) => ({
      ...prev,
      folders: [...prev.folders, newFolder],
    }));
  };

  const handleBreadcrumbClick = (crumb) => {
    if (crumb.id === parentId) return;

    const newBreadcrumbs = breadcrumbs.slice(
      0,
      breadcrumbs.findIndex((b) => b.id === crumb.id) + 1
    );
    setBreadcrumbs(newBreadcrumbs);

    setParentId(crumb.id);
    fetchFolderContents(crumb.id);
  };

  useEffect(() => {
    fetchFolderContents(parentId);
  }, []);

  return (
    <div className="px-5 mt-8">
      <div className="flex justify-between my-4 align-middle">
        <p className="font-bold text-xl">Cloud Storage</p>

        <Button
          icon={<VscNewFolder size="20px" />}
          onClick={() => setIsModalOpen(true)}
        >
          New Folder
        </Button>

        <NewFolderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFolderCreated={handleFolderCreated}
        />
      </div>

      <Breadcrumbs
        breadcrumbs={breadcrumbs}
        parentId={parentId}
        onClick={handleBreadcrumbClick}
      />

      {loader && <Loader />}

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 text-center mt-10">
        {storage?.folders?.map((folder) => (
          <div key={folder._id} onClick={() => handleFolderClick(folder)}>
            <Folder title={folder.name} />
          </div>
        ))}

        {storage?.files?.map((file) => (
          <div key={file._id} onClick={() => handleFileClick(file)}>
            <File title={file.name} type={getFileCategory(file.type)} />
          </div>
        ))}
      </div>

      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
};

export default CloudStorage;
