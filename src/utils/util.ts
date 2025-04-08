// 파일 입력 변경 이벤트를 처리하는 함수
export const handleFileChange = (
  event: React.ChangeEvent<HTMLInputElement>, // 파일 입력 이벤트 객체
  onFileLoad: (fileData: string) => void // 파일 데이터를 처리할 콜백 함수
) => {
  const { files } = event.target; // 이벤트 대상에서 파일 리스트를 가져옴
  if (files && files.length === 1) {
    // 파일이 존재하고 하나만 선택된 경우
    const reader = new FileReader(); // FileReader 객체 생성 (파일 읽기용)
    reader.onloadend = () => {
      // 파일 읽기가 끝났을 때 실행되는 콜백
      const result = reader.result as string; // 읽어들인 파일 데이터를 문자열로 변환
      console.log("File data encoded:", result); // 디버깅용 로그 출력
      onFileLoad(result); // 파일 데이터를 콜백 함수로 전달
    };
    reader.readAsDataURL(files[0]); // 파일을 Data URL 형식으로 읽음
  }
};
