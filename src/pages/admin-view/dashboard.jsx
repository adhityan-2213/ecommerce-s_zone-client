import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, updateFeatureImage, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log(featureImageList, "featureImageList");

  const [editingId, setEditingId] = useState(null);

  async function handleDeleteFeature(id) {
    if (!confirm("Delete this image?")) return;
    dispatch(deleteFeatureImage(id)).then(() => dispatch(getFeatureImages()));
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    // use uploadedImageUrl (updated by ProductImageUpload) as new image
    dispatch(updateFeatureImage({ id: editingId, image: uploadedImageUrl })).then(
      (res) => {
        if (res?.payload?.success) {
          dispatch(getFeatureImages());
          setEditingId(null);
          setUploadedImageUrl("");
          setImageFile(null);
        }
      }
    );
  }

  function handleStartEdit(item) {
    setEditingId(item._id);
    setUploadedImageUrl(item.image);
    setImageFile(null);
  }

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      <div className="flex gap-2 mt-3">
        {!editingId ? (
          <Button onClick={handleUploadFeatureImage} className="w-full">
            Upload
          </Button>
        ) : (
          <>
            <Button onClick={handleSaveEdit} className="w-full">
              Save Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setUploadedImageUrl("");
                setImageFile(null);
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative" key={featureImgItem._id}>
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button size="sm" onClick={() => handleStartEdit(featureImgItem)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteFeature(featureImgItem._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;