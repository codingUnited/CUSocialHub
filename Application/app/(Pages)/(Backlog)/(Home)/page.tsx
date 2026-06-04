import { redirect } from "next/navigation";

export default function Redirect() {
  redirect("/polls");
}



// "use client";

// import { Button, Card, Container, Field, HStack, Input, Stack } from "@chakra-ui/react/";

// export default function Home() {


//   return (
//     <Container maxW="md" py="12">
//       <form
//         onSubmit={(e) => {
//           e.preventDefault()
//           console.log("Form submitted!")
//         }}
//       >
//         <Card.Root>
//           <Card.Header>
//             <Card.Title textStyle="2xl">Create an Account</Card.Title>
//             <Card.Description>
//               Fill in the form below to get started.
//             </Card.Description>
//           </Card.Header>

//           <Card.Body>
//             <Stack gap="5" w="full">
//               {/* Side-by-side fields for Name */}
//               <HStack gap="4">
//                 <Field.Root required>
//                   <Field.Label>First Name</Field.Label>
//                   <Input name="firstName" placeholder="Jane" />
//                 </Field.Root>
//                 <Field.Root required>
//                   <Field.Label>Last Name</Field.Label>
//                   <Input name="lastName" placeholder="Doe" />
//                 </Field.Root>
//               </HStack>

//               {/* Full width field for Email */}
//               <Field.Root required>
//                 <Field.Label>Email Address</Field.Label>
//                 <Input name="email" type="email" placeholder="jane@example.com" />
//               </Field.Root>

//               {/* Full width field for Password with Helper Text */}
//               <Field.Root required>
//                 <Field.Label>Password</Field.Label>
//                 <Input name="password" type="password" placeholder="••••••••" />
//                 <Field.HelperText>Must be at least 8 characters long.</Field.HelperText>
//               </Field.Root>
//             </Stack>
//           </Card.Body>

//           <Card.Footer justifyContent="flex-end" gap="3">
//             <Button variant="outline">Cancel</Button>
//             <Button variant="solid" colorPalette="blue" type="submit">
//               Sign Up
//             </Button>
//           </Card.Footer>
//         </Card.Root>
//       </form>
//     </Container>

//   );
// }
