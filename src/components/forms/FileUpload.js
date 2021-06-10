import React from "react";
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import {useSelector} from 'react-redux'
import {Avatar, Badge} from 'antd'


const FileUpload = ({values, setValues, setLoading}) => {
    const {user} = useSelector(state=> ({...state}))

  const fileUploadAndResize = (e) => {
    //   console.log(e.target.files)
    let files = e.target.files
    let allUploadedFiles = values.images;

    if(files) {
        setLoading(true)
        for(let i = 0; i<files.length; i++) {
            Resizer.imageFileResizer(files[i],720, 720, "JPEG", 100, 0, (uri)=> {
                axios.post(`${process.env.REACT_APP_API}/uploadimages`, {image: uri}, {
                    headers: {
                        authtoken: user.token.token 
                    }
                })
                .then(res=> {
                    console.log('Image upload res data', res)
                    setLoading(false)
                    allUploadedFiles.push(res.data)
                    setValues({...values, images: allUploadedFiles})
                })
                .catch(err=> {
                   setLoading(false)
                   console.log('Cloudinary UPLOAD ERROR', err)
                })
            }, "base64")
        }
    }
  };

  const handleImageRemove = id => {
      setLoading(true)
     axios.post(`${process.env.REACT_APP_API}/removeimage`, {public_id: id}, {
         headers: {
             authtoken: user ? user.token.token : ''
          }
     })
     .then(res=> {
setLoading(false)
const {images} = values
let filteredImages = images.filter(i=>  i.public_id !== id)
setValues({...values, images: filteredImages})
     })
     .catch(err=> {
   console.log(err)
   setLoading(false)
     })
  }
  return (
    <>
    <div className="row">
        {values.images && values.images.map((image)=> (
               <Badge style={{cursor: 'pointer'}} count='X' key={image.public_id} onClick={()=> handleImageRemove(image.public_id)}><Avatar  src={image.url}  size={100} className='ml-3' shape='square'  /></Badge>
        ))}
    </div>
    <br />
      <div className="row">
        <label
          style={{ cursor: "pointer" }}
          className="btn btn-primary btn-raised"
        >
          Choose File
          <input
            type="file"
            multiple
            accept="images/*"
            onChange={fileUploadAndResize}
            hidden
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
