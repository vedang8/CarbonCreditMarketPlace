import React, { useState } from 'react'
import { Button, Upload, message } from 'antd';
import { useDispatch } from "react-redux";
import { SetLoader } from '../../redux/loadersSlice';
function Images({
    selectedCredit,
    setShowCreditsForm,
    getData,
}) {
  const [file=null, setFile] = useState(null);
  const dispatch = useDispatch();
  const upload = () => {
    try{
      dispatch(SetLoader(true)); 
      // Upload Image to cloudinary 
      
    }catch(error){
      dispatch(SetLoader(false)); 
      message.error(error.message);
    }
  }
  return (
    <div>
        <Upload listType="picture" beforeUpload={() => false} onChange={(info) => {setFile(info.file);}}>
            <Button type="dashed">Upload Image</Button>
        </Upload>
        <div className='flex justify-end gap-5 md-5'>
            <Button type="default" onClick={()=>{setShowCreditsForm(false);}}>
             Cancel
            </Button>
            <Button type="primary" disabled={!file} onClick={upload}>
              Upload
            </Button>
        </div>
    </div>
    
//     <div className="form_input">
//     <label htmlFor="images">Upload Images</label>
//     <input type="file" multiple name="images" id="images" />
//   </div>

  )
}

export default Images;