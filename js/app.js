$(function(){
	$("div> h1").css("background-color","red");
	$('a').attr("href","http://www.hutech.edu.vn");
	$('a').text("Truong DH Cong Nghe TPHCM");
	$("#username").validate({
		errorElement: "span", // Định dạng cho thẻ HTML hiện thông báo lỗi
		rules: {
			cpassword: {
				equalTo: "" // So sánh trường cpassword với trường có id là password
			}
		}
	});
	$("#addRow").click(function(){
		$('table > tbody:last-child').append('<tr><td><select><option>Email</option><option>'+
		'</option></select></td><td><input/> </td><td>comments</td><td><input/> </td></tr>');
	})
});