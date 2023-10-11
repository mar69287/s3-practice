import './App.css';
import { useState } from 'react'
import { getUser } from '../../utilities/users-service'
import AuthPage from '../AuthPage/AuthPage';
import NavBar from '../../components/NavBar/NavBar'
import { Button, Image, Input, VStack } from "@chakra-ui/react";
import axios from 'axios'
import { createProfile, getUserProfile } from '../../utilities/profiles-api'

export default function App() {
  const [ user, setUser ] = useState(getUser())
  const [selectedFile, setSelectedFile] = useState(null);
  const [profile, setProfile] = useState(null)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    // if (!selectedFile) {
    //   console.error("No file selected");
    //   return;
    // }

    try {
      // const formData = new FormData();
      // formData.append('image', selectedFile);
      // const imageName = await axios.post("/api/images", formData, { headers: {'Content-Type': 'multipart/form-data'}})
      // console.log(imageName.data)
      // const profile = await createProfile({
      //   user: user._id,
      //   profilePic: imageName.data
      // })
      const userProfile = await getUserProfile()
      setProfile(userProfile)
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    try {

    } catch {

    }
  };

  return (
    <main className="App">
      {
        user ?
        <>
          <NavBar user={user} setUser={setUser} />
          <VStack spacing={4} align="stretch">
            <Input type="file" onChange={handleFileChange} />
            <Button colorScheme="teal" onClick={handleFileUpload}>
              Upload
            </Button>
          </VStack>
          {profile && 
          <Image src={profile.profilePic}  boxSize={20}/>
          }
        </>
        :
        <AuthPage setUser={setUser} />
      }
    </main>
  );
}


