import React, { useState } from 'react';
import { Typography, Button, Form, Icon, Input } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOption = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const CategoryOption = [
  { value: 0, label: 'Flim & Animation' },
  { value: 1, label: 'Autos & Vehicles' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Pets & Animals' },
];

function UploadVideoPage(props) {
  const [VideoTitle, setVideoTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState('Flim & Animation');
  const [FilePath, setFilePath] = useState();
  const [Duration, setDuration] = useState('');
  const [ThumbnailPath, setThumbnailPath] = useState('');
  const user = useSelector((state) => state.user);

  //console.log({VideoTitle,Description,Private,Category});
  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onPrivateChange = (e) => {
    setPrivate(e.target.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const onDrop = (files) => {
    //console.log(files);
    let formData = new FormData();
    const conpig = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]); //append 메소드로 키-값 형식으로 추가

    Axios.post('/api/video/uploadfiles', formData, conpig).then((res) => {
      if (res.data.sucess) {
        console.log('------업로드 영상 res-----');

        console.log(res.data);

        let variable = {
          url: res.data.url,
          fileName: res.data.fileName,
        };

        setFilePath(res.data.url);

        Axios.post('/api/video/thumbnail', variable).then((res) => {
          if (res.data.success) {
            console.log('------썸네일 res-----');
            console.log(res.data);
            setDuration(res.data.fileDuration);
            setThumbnailPath(res.data.thumbsFilePath);
          } else {
            alert('Failed to make the thumbnails');
          }
        });
      } else {
        alert('파일 업로드를 실패했습니다.');
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    var variable = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    Axios.post('/api/video/uploadVideo', variable).then((res) => {
      if (res.data.success) {
        console.log('------submit click-----');
        console.log(res.data);

        setTimeout(() => {
          if (!alert('업로드가 되었습니다.')) {
            props.history.push('/');
          }
        }, 2000);
      } else {
        alert('업로드를 실패 했습니다.');
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={1}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: '300px',
                  height: '240px',
                  border: '1px solid lightgray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem' }} />
              </div>
            )}
          </Dropzone>

          {/* thumbnail */}
          {ThumbnailPath !== '' && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {PrivateOption.map((Item, index) => (
            <option key={index} value={Item.value}>
              {Item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOption.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UploadVideoPage;

// 불러오기 : axios.get(url[, config])
// 입력하기 : axios.post(url[, data[, config]])
// 수정하기 : axios.patch(url[, data[, config]])
// 삭제하기 : axios.delete(url[, config])
