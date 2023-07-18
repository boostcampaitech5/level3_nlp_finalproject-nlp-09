const record = "Record";

export function Rec() {
  return (
    <div style={{ backgroundColor: '#F6755E', color: "black", width: "100%", height: "100%", position: "relative", paddingTop: "40px", borderRadius: "15px", boxShadow: "10px 10px 5px gray" }} >
      <div style={{
        width: "700px", height: "800px", backgroundColor: 'white', margin: "0 auto", textAlign: "center", paddingTop: "20px", marginTop: "30px", borderRadius: "10px", boxShadow: "5px 5px 10px gray"
      }}>
        <p class="font-extrabold text-rec text-xl"><em>{record}</em></p>
      </div>

    </div >
  );

}
export default Rec;