import LoginForm from "../../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-4 w-full mt-7">
      <div className="place-items-center mt-10 lg:mt-0 px-4 w-full h-full white-gradient-background">
        <LoginForm />
      </div>
      <div className="bg-[#f2f4ff] rounded-3xl w-full min-h-[520px] p-8 text-center hidden lg:grid"></div>
    </div>
  );
};

export default LoginPage;
