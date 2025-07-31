import LoginForm from "../../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="h-[calc(98vh-74px)] overflow-auto flex">
      <div className="grid lg:grid-cols-2 gap-4 w-full">
        <div className="place-content-center place-items-center px-4 white-gradient-background">
          <LoginForm />
        </div>
        <div className="bg-[#f2f4ff] place-self-center rounded-3xl w-full h-[520px] p-8 text-center hidden lg:grid"></div>
      </div>
    </div>
  );
};

export default LoginPage;
