import type {
    GetServerSidePropsContext,
  } from "next"

  
  export async function getServerSideProps(context: GetServerSidePropsContext) {
  
      return { redirect: { destination: "/" } }

  }