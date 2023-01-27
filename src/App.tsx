import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { db } from "./firebase";

type User = {
  id: string;
  name: string;
  height: number;
};

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    //Firebase ver9 compliant (modular)
    // select
    // whereで条件指定
    // const q = query(collection(db, "users"), where("height", "==", 170));
    const q = query(collection(db, "users"), orderBy("height", "desc"));
    getDocs(q).then((querySnapShot) => {
      setUsers(
        querySnapShot.docs.map((doc) => ({
          // idだけ.data()不要であることに注意！
          id: doc.id,
          name: doc.data().name,
          height: doc.data().height,
        }))
      );
    });
  }, []);

  // create
  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      const { name, height } = event.target.elements;
      console.log(name.value, height.value);
      const usersCollectionRef = collection(db, "users");
      // addDocだと、自動でIDが設定される（手動の場合はsetDoc）
      const documentRef = await addDoc(usersCollectionRef, {
        name: name.value,
        height: Number(height.value),
      });
      console.log(documentRef.id);
      const newUsers: User[] = [
        ...users,
        { id: documentRef.id, name: name.value, height: Number(height.value) },
      ];
      setUsers(
        newUsers.sort(function (a, b) {
          if (a.height > b.height) return -1;
          if (a.height < b.height) return 1;
          return 0;
        })
      );
    },
    [users]
  );

  // delete
  const deleteUser = useCallback(
    async (id: string) => {
      const userDocumentRef = doc(db, "users", id);
      await deleteDoc(userDocumentRef);
      setUsers(users.filter((user) => user.id !== id));
    },
    [users]
  );

  // update
  const updateUser = useCallback(
    async (user: User) => {
      const updateId = user.id;
      const userDocumentRef = doc(db, "users", updateId);
      await updateDoc(userDocumentRef, {
        height: 300,
      });
      const newUsers: User[] = users.map((user) => {
        if (user.id === updateId)
          return { id: updateId, name: user.name, height: 300 };
        return user;
      });
      setUsers(
        newUsers.sort(function (a, b) {
          if (a.height > b.height) return -1;
          if (a.height < b.height) return 1;
          return 0;
        })
      );
    },
    [users]
  );
  return (
    <div>
      <h1>Select</h1>
      <h2>Users</h2>
      {users.map((user) => (
        <div key={user.id}>
          {user.name} ({user.height}cm)
          <button onClick={() => deleteUser(user.id)}>削除</button>
          <button onClick={() => updateUser(user)}>更新</button>
        </div>
      ))}

      <div>
        <h1>Create</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>名前</label>
            <input name="name" type="text" placeholder="名前" />
          </div>
          <div>
            <label>身長</label>
            <input name="height" type="height" placeholder="身長" />
          </div>
          <div>
            <button>登録</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
