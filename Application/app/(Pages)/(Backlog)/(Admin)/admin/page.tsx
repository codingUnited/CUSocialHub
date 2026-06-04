import { redirect } from "next/navigation";

export default function Redirect() {
    redirect("/polls");
}

// export default function Admin() {
//     return (
//         <>
//             <h1>Admin Page</h1>
//         </>
//     );

// }