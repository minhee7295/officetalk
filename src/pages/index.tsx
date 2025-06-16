// @review 아래 주석처리한 코드의 역할을 미들웨어가 하고있고 해당 경로로 들어왔을때 무조건적으로 로그인으로 가는게 아니라 세션이 없을때는 로그인으로 가거나 해당 페이지를 list로 꾸미거나 하는게 더 나아보이는 url 경로로 보임
export default function Home() {
  // const router = useRouter();

  // useEffect(() => {
  //   router.replace("/list");
  // }, [router]);

  return null;
}
