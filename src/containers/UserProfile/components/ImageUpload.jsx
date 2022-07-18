import React from 'react'

const ImageUpload = ({ onChange, src }) => (
    <label className="custom-file-upload fas">
      <div className="img-wrap img-upload">
        <img src={src} />
      </div>
      <input id="photo-upload" type="file" onChange={onChange} />
    </label>
  );

export default ImageUpload