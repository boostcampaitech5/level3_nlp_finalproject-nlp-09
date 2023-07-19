const summary = "Summary";

export function Summ() {
  return (
    <div style={{
      backgroundColor: '#FFA831', color: "black", width: "100%", height: "100%", position: "relative", paddingTop: "40px", borderRadius: "15px", boxShadow: "10px 10px 5px gray"
    }}>
      < div style={{
        width: "700px", height: "800px", backgroundColor: 'white', margin: "0 auto", textAlign: "center", paddingTop: "20px", marginTop: "30px", borderRadius: "10px", boxShadow: "5px 5px 10px gray"
      }}>
        <p class="font-extrabold text-summ text-xl"><em>{summary}</em></p>
      </div >
    </div >
  );

}
export default Summ;