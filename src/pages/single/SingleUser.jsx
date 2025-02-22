import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import defaultUserIcon from "../../images/defaultUserIcon.png";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showInfoToast } from "../../components/toast/Toast";

const Single = () => {
  //------------------ Retrieve User ID  ------------------//
  const { userId } = useParams();
  // console.log(userId);

  const navigate = useNavigate();

  //------------------ Retrieve Users Data  ------------------//
  const [userData, setUserData] = useState();

  const getUserData = async () => {
    const docRef = doc(db, "UserData", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data: ", docSnap.data());
      setUserData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  //------------------ Handle Change for Input  ------------------//
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newContactNumber, setNewContactNumber] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const handleChange = (e) => {
    const numberOnly = e.target.value.replace(/[^0-9]/g, "");
    setNewContactNumber(numberOnly);
  };
  // console.log(newAddress);

  //------------------ Update User Data Function  ------------------//
  const handleUpdate = async () => {
    const docRef = doc(db, "UserData", userId);

    if (docRef !== null) {
      const updates = {};

      if (newFirstName !== "") {
        updates.firstName = newFirstName;
      }

      if (newLastName !== "") {
        updates.lastName = newLastName;
      }

      if (newEmail !== "") {
        updates.email = newEmail;
      }

      if (newContactNumber !== "") {
        updates.contactNumber = newContactNumber;
      }

      if (newAddress !== "") {
        updates.address = newAddress;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(docRef, updates);
        showSuccessToast("User data is updated", 1000);
        navigate(-1);
      } else {
        showInfoToast("No changes made");
      }
    } else {
      showInfoToast("No user data");
    }
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={handleUpdate}>
              Save
            </div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img src={defaultUserIcon} alt="" className="itemImg" />
              <div className="details">
                {/*-------------------- Full Name -------------------- */}
                <h1 className="itemTitle">
                  Full Name:&nbsp;{userData?.firstName}&nbsp;
                  {userData?.lastName}
                </h1>

                {/*-------------------- First Name -------------------- */}
                <div className="detailItem">
                  <span className="itemKey">First Name:</span>
                  <span className="itemValue">{userData?.firstName}</span>
                </div>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New First Name"
                  onChange={(e) => setNewFirstName(e.target.value)}
                />

                {/*-------------------- Last Name -------------------- */}
                <div className="detailItem">
                  <span className="itemKey">Last Name:</span>
                  <span className="itemValue">{userData?.lastName}</span>
                </div>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Last Name"
                  onChange={(e) => setNewLastName(e.target.value)}
                />

                {/*-------------------- Email -------------------- */}
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{userData?.email}</span>
                </div>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Email Address"
                  onChange={(e) => setNewEmail(e.target.value)}
                />

                {/*-------------------- Contact Number -------------------- */}
                <div className="detailItem">
                  <span className="itemKey">Contact Number:</span>
                  <span className="itemValue">{userData?.contactNumber}</span>
                </div>
                <input
                  type="text"
                  maxLength={11}
                  value={newContactNumber}
                  placeholder="New Contact Number"
                  // onChange={(e) => setNewContactNumber(e.target.value)}
                  onChange={handleChange}
                />

                {/*-------------------- Address -------------------- */}
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">{userData?.address}</span>
                </div>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Address"
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Single;
