import NextAuth from "next-auth";

// Every API request beginning with /api/auth/* is handled by the code written here in the [...nextauth] file, i.e. the NextAuth method with the authOptions as parameters
// Still, in the background this is stil a regular API route being with the NextAuth method 'hiding' the traditional Request and Response format

import { authOptions } from "@/server/auth";

export default NextAuth(authOptions);
