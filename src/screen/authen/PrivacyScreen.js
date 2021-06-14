import React from 'react';
import {WebView} from 'react-native-webview';
import {ActivityIndicator, Dimensions, View} from 'react-native';

import CommonHeader from '~/BaseComponent/components/layouts/CommonHeader';
import {translate} from '~/utils/multilanguage';

const WIDTH_DEVICE = Dimensions.get('screen').width;

class PrivacyScreen extends React.PureComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <CommonHeader title={translate('Quy định bảo mật')} themeWhite />
        <WebView
          showsVerticalScrollIndicator={false}
          startInLoadingState
          useWebKit
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color="#E2E2E2"
              style={{
                position: 'absolute',
                top: 15,
                left: (WIDTH_DEVICE - 30) / 2,
              }}
            />
          )}
          source={{
            html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
            <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
            <style>
              * {
                font-family: Roboto;
              }
            </style>
          </head>
          <body>
            <div class="privacy-wrap">
              <div class="container mt-3 privacy-content">
                <h4>Điều 1: Giải thích từ ngữ:</h4>
                <p>
                  Thỏa Thuận: là bản Thỏa Thuận Cung Cấp Và Sử Dụng Ứng Dụng English For School này (sau đây gọi là Thỏa Thuận) cùng với tất cả các bản sửa đổi, bổ sung, cập nhật.
                </p>
                <p>English For School: là ứng dụng do chúng tôi là chủ quản.</p>
                <p>
                  Thông Tin Cá Nhân: là thông tin gắn liền với việc xác định danh tính, nhân thân của cá nhân bao gồm tên, tuổi, địa chỉ, số chứng minh nhân dân, số điện thoại, địa chỉ thư điện tử, tài khoản ngân hàng của Người Sử Dụng và một số thông tin khác theo quy định của pháp luật.
                </p>
                <p>
                  Người Sử Dụng: là chủ tài khoản, sở hữu, sử dụng hợp pháp tài khoản English For School.
                </p>
                <p>
                  Sở Hữu Trí Tuệ: bao gồm quyền khởi kiện, quyền thiết kế, báo cáo, dữ liệu, cơ sở dữ liệu, công cụ, mã, ảnh, hình ảnh, video, giao diện, các trang web, thiết kế, văn bản, đồ họa, thông tin, phần mềm, các tệp âm thanh và các tệp media khác, các lựa chọn và cách sắp xếp chúng, tài liệu và tất cả các quyền sở hữu trí tuệ khác.
                </p>
          
                <h4>Điều 2: Nội dung dịch vụ</h4>
                <p>
                  Các dịch vụ của chúng tôi bao gồm nhiều nội dung và khóa học, được thiết kế để tạo điều kiện cho việc học các nội dung có sẵn trên ứng dụng, người dùng có thể sử dụng trên thiết bị di động, máy tính xách tay và / hoặc máy tính bảng hoặc bất kỳ thiết bị nào khác, dù đã được phát minh hay sắp được phát minh, theo đó bạn có thể truy cập nội dung và các khóa học của chúng tôi, được gọi là dịch vụ của chúng tôi cung cấp cho bạn.
                </p>
          
                <h4>Điều 3: Chấp nhận điều khoản sử dụng và sửa đổi</h4>
                <p>
                  Để truy cập và sử dụng Dịch vụ English For School , Người Sử Dụng phải đồng ý và tuân theo các điều khoản được quy định tại Thỏa thuận này và quy định.
                </p>
                <p>
                  Khi truy cập, sử dụng English For School bằng bất cứ phương tiện (máy tính, điện thoại, máy tính bảng) thì Người Sử Dụng cũng phải tuân theo Quy chế này.
                </p>
                <p>
                  Để đáp ứng nhu cầu sử dụng của Người Sử Dụng, English For School không ngừng hoàn thiện và phát triển, vì vậy các điều khoản quy định tại Thỏa thuận cung cấp và sử dụng ứng dụng English For School, sẽ công bố rõ trên Website, diễn đàn về những thay đổi, bổ sung đó.
                </p>
          
                <h4>Điều 4: Đăng kí tài khoản và sử dụng dịch vụ.</h4>
                <p>
                  Người Sử Dụng tự chịu trách nhiệm về năng lực hành vi trong việc đăng ký tài khoản và sử dụng English For School.
                </p>
                <p>
                  Người Sử Dụng có thể đăng nhập English For School từ các tài khoản liên kết khác mà English For School cho phép.
                </p>
                <p>
                  Sau khi Người Sử Dụng đăng nhập vào English For School, Người Sử Dụng có thể thay đổi tên thành viên. Tên thành viên phải tuân theo nội quy đặt tên theo quy định, không vi phạm những điều cấm của Thỏa thuận này. Tên thành viên sẽ được hiển thị trên ứng dụng English For School.
                </p>
                <p>
                  Các tính năng của English For School yêu cầu Người Sử Dụng phải đăng ký, đăng nhập để sử dụng. Chúng tôi khuyến khích Người Sử Dụng đăng ký tài khoản để sử dụng English For School được tốt nhất.
                </p>
          
                <h4>Điều 5: Các nội dung cấm trao đổi và chia sẻ trên ứng dụng</h4>
                <p>
                  Khi sử dụng sản phẩm English For School, nghiêm cấm khách hàng một số hành vi bao gồm nhưng không giới hạn sau:
                </p>
                <p>
                  Lợi dụng việc cung cấp, trao đổi, sử dụng thông tin trên English For School nhằm mục đích:
                </p>
                <ul>
                  <li>
                    Chống lại Nhà nước Cộng hoà xã hội chủ nghĩa Việt Nam; gây phương hại
                    đến an ninh quốc gia, trật tự, an toàn xã hội; phá hoại khối đại đoàn
                    kết toàn dân; tuyên truyền chiến tranh xâm lược, khủng bố; gây hận
                    thù, mâu thuẫn giữa các dân tộc, sắc tộc, chủng tộc, tôn giáo;
                  </li>
                  <li>
                    Tuyên truyền, kích động bạo lực, dâm ô, đồi trụy, tội ác, tệ nạn xã
                    hội, mê tín dị đoan, phá hoại thuần phong, mỹ tục của dân tộc.
                  </li>
                  <li>
                    Người Sử Dụng lợi dụng việc sử dụng English For School nhằm tiết lộ bí mật nhà
                    nước, bí mật quân sự, an ninh, kinh tế, đối ngoại và những bí mật khác
                    do pháp luật quy định bằng bất cứ hình thức nào trên English For School.
                  </li>
                  <li>
                    Người Sử Dụng có quyền sử dụng đối với hình ảnh của mình. Khi sử dụng
                    hình ảnh của cá nhân khác, Người Sử Dụng phải được sự đồng ý của cá
                    nhân đó. Nghiêm cấm việc sử dụng hình ảnh của người khác mà xâm phạm
                    danh dự, nhân phẩm, uy tín của người có hình ảnh.
                  </li>
                  <li>
                    Lợi dụng ứng dụng English For School để thu thập thông tin của Người Sử Dụng, công bố thông tin, tư liệu về đời tư của Người Sử Dụng khác.
                  </li>
                  <li>
                    Đặt thành viên theo tên của danh nhân, tên các vị lãnh đạo của Đảng và
                    Nhà nước, tên của cá nhân, tổ chức tội phạm, phản động, khủng bố hoặc
                    tài khoản có ý nghĩa không lành mạnh, trái với thuần phong mỹ tục.
                  </li>
                  <li>
                    Đưa thông tin xuyên tạc, vu khống, nhạo báng, xúc phạm uy tín tới tổ
                    chức, cá nhân dưới bất kỳ hình thức nào (nhạo báng, chê bai, kỳ thị
                    tôn giáo, giới tính, sắc tộc….).
                  </li>
                  <li>
                    Hành vi, thái độ làm tổn hại đến uy tín English For School dưới bất kỳ hình thức hoặc phương thức nào.
                  </li>
                  <li>
                    Cản trở trái pháp luật, gây rối, phá hoại hệ thống máy chủ; Cản trở
                    việc truy cập thông tin và sử dụng các dịch vụ hợp pháp trên English For School.
                  </li>
                  <li>
                    Sử dụng trái phép mật khẩu, khoá mật mã của các tổ chức, cá nhân,
                    thông tin riêng, thông tin cá nhân và tài nguyên Internet.
                  </li>
                  <li>
                    Trực tiếp hoặc gián tiếp sử dụng bất kỳ thiết bị, phần mềm, trang web
                    Internet, dịch vụ dựa trên web, hoặc các phương tiện khác để gỡ bỏ,
                    thay đổi, bỏ qua, lẩn tránh, cản trở, hoặc phá hoại bất kỳ bản quyền,
                    thương hiệu, hoặc các dấu hiệu về quyền sở hữu khác được đánh dấu trên
                    Nội dung (như logo) hoặc bất kỳ hệ thống kiểm soát dữ liệu, thiết bị,
                    biện pháp bảo vệ nội dung khác cũng như các biện pháp hạn chế truy cập
                    từ các vùng địa lý khác nhau.
                  </li>
                  <li>
                    Trực tiếp hoặc gián tiếp thông qua bất kỳ thiết bị, phần mềm, trang
                    web Internet, dịch vụ dựa trên web, hoặc các phương tiện khác để sao
                    chép, tải về, chụp lại, sản xuất lại, nhân bản, lưu trữ, phân phối,
                    tải lên, xuất bản, sửa đổi, dịch thuật, phát sóng, trình chiếu, hiển
                    thị, bán, truyền tải hoặc truyền lại nội dung trừ khi được sự cho phép
                    của English For School bằng văn bản.
                  </li>
                  <li>
                    Tạo ra, tái tạo, phân phối hay quảng cáo một chi tiết của bất kỳ nội
                    dung trừ khi được phép của English For School. Bạn không được phép xây dựng mô
                    hình kinh doanh sử dụng các Nội dung cho dù là có hoặc không vì lợi
                    nhuận. Nội dung được đề cập tại English For School bao gồm nhưng không giới hạn
                    bất kỳ văn bản, đồ họa, hình ảnh, bố trí, giao diện, biểu tượng, hình
                    ảnh, tài liệu âm thanh và video, và ảnh tĩnh. Ngoài ra, chúng tôi
                    nghiêm cấm việc tạo ra các sản phẩm phát sinh hoặc vật liệu có nguồn
                    gốc từ hoặc dựa trên bất kì Nội dung nào bao gồm dựng phim, làm video
                    tương tự, hình nền, chủ đề máy tính, thiệp chúc mừng, và hàng hóa, trừ
                    khi nó được sự cho phép của English For School bằng văn bản.
                  </li>
                  <li>
                    Giả mạo tổ chức, cá nhân và phát tán thông tin giả mạo, thông tin sai
                    sự thật trên English For School xâm hại đến quyền và lợi ích hợp pháp của tổ
                    chức, cá nhân.
                  </li>
                  <li>
                    Tạo đường dẫn trái tới tên miền hợp pháp của tổ chức, cá nhân. Tạo,
                    cài đặt, phát tán các phần mềm độc hại, vi rút máy tính; xâm nhập trái
                    phép, chiếm quyền điều khiển hệ thống thông tin, tạo lập công cụ tấn
                    công trên Internet.
                  </li>
                  <li>
                    Tuyệt đối không sử dụng bất kỳ chương trình, công cụ hay hình thức nào
                    khác để can thiệp vào English For School.
                  </li>
                  <li>
                    Nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào
                    nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của sản phẩm cung
                    cấp hoặc hệ thống máy chủ English For School.
                  </li>
                  <li>
                    Không được có bất kỳ hành vi nào nhằm đăng nhập trái phép hoặc tìm
                    cách đăng nhập trái phép hoặc gây thiệt hại cho hệ thống máy chủ
                    English For School.
                  </li>
                  <li>
                    Nghiêm cấm mọi hành vi xâm phạm khác dưới mọi hình thức tới sản phẩm,
                    tài sản và uy tín của English For School.
                  </li>
                </ul>
          
                <h4>Điều 6: Quy tắc quản lí vi phạm của Người Sử Dụng</h4>
                <p class="font-weight-bold">
                  Nguyên tắc.
                </p>
                <p>
                  Người Sử Dụng vi phạm thỏa thuận cung cấp và sử dụng phần mềm thì tùy
                  theo mức độ nghiêm trọng của hành vi sẽ bị xử lý tương ứng.
                </p>
                <p>
                  Trường hợp hành vi vi phạm của Người Sử Dụng chưa được quy định trong
                  thỏa thuận này thì tùy vào tính chất, mức độ của hành vi vi phạm,
                  English For School sẽ đơn phương, toàn quyền quyết định mức xử lý hợp lý.
                </p>
                <p class="font-weight-bold">
                  Các hình thức xử lý:
                </p>
                <p>
                  Hình thức xử lý 1: Khóa tài khoản 7 ngày
                </p>
                <p>
                  Hình thức xử lý 2: Khóa tài khoản 30 ngày
                </p>
                <p>
                  Hình thức xử lý 3: Khóa tài khoản 120 ngày hoặc khóa tài khoản vĩnh
                  viễn.
                </p>
                <p>
                  Hình thức xử lý 3, khóa tài khoản 120 ngày hoặc khóa vĩnh viễn được áp
                  dụng bao gồm nhưng không giới hạn đối với các hành vi sau:
                </p>
                <ul>
                  <li>
                    Người Sử Dụng có hành vi lợi dụng English For School nhằm chống phá nước Cộng Hòa
                    Xã Hội Chủ Nghĩa Việt Nam. Hành vi này bao gồm nhưng không giới hạn
                    việc người dùng đặt tên thành viên cá nhân trong phòng cộng đồng trùng
                    tên với các vĩ nhân, các vị anh hùng của dân tộc, các vị lãnh đạo của
                    đảng và nhà nước, hoặc người dùng có sử dụng hình ảnh, video, phát
                    ngôn… có chứa thông tin bàn luận về vấn đề chính trị hoặc tiết lộ bí
                    mật nhà nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
                  </li>
                  <li>
                    Lan truyền thông tin lừa đảo: Sử dụng văn bản, hình ảnh, âm thanh hoặc
                    video có chứa thông tin lừa đảo: giả làm chính thức hoặc các tổ chức,
                    cá nhân; gian lận, lừa đảo tài sản của người khác hoặc tài khoản
                    English For School.
                  </li>
                  <li>
                    Phá hoại hệ thống ứng dụng English For School: Thành viên lợi dụng việc sử dụng
                    sản phẩm để xâm nhập vào hệ thống máy chủ nhằm phá hoại sản phẩm hoặc
                    cản trở việc truy cập thông tin. Thành viên sử dụng công cụ kỹ thuật
                    nhằm tăng điểm hoạt động.
                  </li>
                </ul>
          
                <p>
                  Hình thức xử lý 2, khóa tài khoản 30 ngày được áp dụng bao gồm nhưng
                  không giới hạn đối với các hành vi sau:
                </p>
          
                <ul>
                  <li>
                    Xâm phạm riêng tư: Sử dụng hình ảnh cá nhân của người khác, công khai
                    những tư liệu cá nhân và những thông tin của khác như danh tính, địa
                    chỉ, số điện thoại mà chưa được sự đồng ý và tiến hành gọi điện quấy
                    nhiễu hoặc khích động người khác quấy nhiễu.
                  </li>
                  <li>
                    Công kích người khác: Sử dụng hình ảnh, thông tin, âm thanh hoặc
                    video, xúc phạm, đưa thông tin xuyên tạc, vu khống, nhạo bang, xúc
                    phạm uy tín tới tổ chức, cá nhân.
                  </li>
                </ul>
          
                <p>
                  Hình thức xử lý 1, khóa tài khoản 7 ngày được áp dụng bao gồm nhưng
                  không giới hạn đối với các hành vi sau:
                </p>
                <p>
                  Công kích, xuyên tạc, xúc phạm nhân phẩm các thành viên khác.
                </p>
          
                <h4>Điều 7: Quyền và nghĩa vụ của người sử dụng English For School</h4>
          
                <p>
                  Khi đăng ký tài khoản English For School, Người Sử Dụng được sử dụng một phần hoặc
                  tất cả các dịch vụ trong sản phẩm English For School.
                </p>
                <p>
                  Người Sử Dụng có trách nhiệm bảo mật thông tin tài khoản, nếu những thông tin trên bị tiết lộ dưới bất kỳ hình thức nào thì Người Sử Dụng phải chấp nhận những rủi ro phát sinh. Chúng tôi sẽ căn cứ vào những thông tin hiện có trong tài khoản để làm căn cứ quyết định chủ sở hữu tài khoản nếu có tranh chấp và sẽ không chịu trách nhiệm về mọi tổn thất phát sinh.
                </p>
                <p>
                  Người Sử Dụng được quyền thay đổi tên thành viên. Tuy nhiên việc đổi tên thành viên không vi phạm các điều khoản cấm về cách đặt tên tài khoản, thành viên.
                </p>
                <p>
                  Người Sử Dụng đồng ý sẽ thông báo ngay cho chúng tôi về bất kỳ trường hợp nào sử dụng trái phép tài khoản và mật khẩu của bạn hoặc bất kỳ các hành động phá vỡ hệ thống bảo mật nào. Bạn cũng bảo đảm rằng, bạn luôn thoát tài khoản của mình sau mỗi lần sử dụng.
                </p>
                <p>
                  Người Sử Dụng phải tuân thủ tuyệt đối quy định về các hành vi cấm, các nội dung trao đổi cung cấp thông tin được quy định trong quy chế này. Nếu vi phạm một hoặc nhiều hành vi, tùy thuộc vào mức độ vi phạm chúng tôi sẽ khóa tài khoản vĩnh viễn, tước bỏ mọi quyền lợi của bạn đối các sản phẩm của chúng tôi và sẽ yêu cầu cơ quan chức năng truy tố bạn trước pháp luật nếu cần thiết.
                </p>
                <p>
                  Thực hiện quyền và trách nhiệm khác theo quy định pháp luật.
                </p>
          
                <h4>Điều 8: Bản quyền và quy trình báo cáo vi phạm bản quyền</h4>
          
                <p>
                  Tất cả quyền sở hữu trí tuệ tồn tại trong English For School đều thuộc về chúng tôi hoặc được cấp phép hợp pháp cho chúng tôi sử dụng, theo đó, tất cả các quyền hợp pháp đều được đảm bảo. Trừ khi được sự đồng ý của chúng tôi, Người Sử Dụng không được phép sử dụng, sao chép, xuất bản, tái sản xuất, truyền hoặc phân phát bằng bất cứ hình thức nào, bất cứ thành phần nào các quyền sở hữu trí tuệ đối với sản phẩm English For School.
                </p>
                <p>
                  Chúng tôi có toàn quyền, bao gồm nhưng không giới hạn trong các quyền tác giả, thương hiệu, bí mật kinh doanh, nhãn hiệu và các quyền sở hữu trí tuệ khác trong sản phẩm English For School của chúng tôi. Việc sử dụng quyền và sở hữu của chúng tôi cần phải được chúng tôi cho phép trước bằng văn bản. Ngoài việc được cấp phép bằng văn bản, chúng tôi không cấp phép dưới bất kỳ hình thức nào khác cho dù đó là hình thức công bố hay hàm ý để bạn thực hiện các quyền trên. Và do vậy, Người Sử Dụng không có quyền sử dụng sản phẩm của chúng tôi vào mục đích thương mại mà không có sự cho phép bằng văn bản của chúng tôi trước đó.
                </p>
          
                <h4>
                  Điều 9: Thu thập thông tin cá nhân và chính sách bảo vệ thông tin các
                  nhân, thông tin riêng của người sử dụng dịch vụ ứng dụng.
                </h4>
                <p>
                  Để đảm bảo phục vụ và cung cấp tới người sử dụng các dịch vụ ngày càng
                  tốt hơn và thực hiện việc cung cấp cho các cơ quan chức năng có thẩm
                  quyền khi có yêu cầu, English For School sẽ tiến hành thu thập dữ liệu của người sử
                  dụng bao gồm: họ tên, số điện thoại, email, tên đăng nhập, mật khẩu đăng
                  nhập.
                </p>
          
                <p class="font-weight-bold">1. Mục đích và phạm vi thu thập</p>
                <p>
                  Việc thu thập dữ liệu chủ yếu trên ứng dụng English For School bao gồm: họ tên, số
                  điện thoại, email, tên đăng nhập, mật khẩu đăng nhập. Đây là các thông
                  tin mà English For School cần thành viên cung cấp bắt buộc khi đăng ký sử dụng dịch
                  vụ và để English For School liên hệ xác nhận khi thành viên đăng ký sử dụng dịch vụ
                  trên website nhằm đảm bảo quyền lợi cho chính các thành viên.
                </p>
                <p>
                  Các thành viên sẽ tự chịu trách nhiệm về bảo mật và lưu giữ mọi hoạt
                  động sử dụng dịch vụ dưới tên đăng ký, mật khẩu và hộp thư điện tử của
                  mình. Ngoài ra, thành viên có trách nhiệm thông báo kịp thời cho ứng
                  dụng English For School về những hành vi sử dụng trái phép, lạm dụng, vi phạm bảo
                  mật, lưu giữ tên đăng ký và mật khẩu của bên thứ ba để có biện pháp giải
                  quyết phù hợp.
                </p>
          
                <p class="font-weight-bold">2. Phạm vi sử dụng thông tin</p>
                <p>Ứng dụng English For School sử dụng thông tin thành viên cung cấp để:</p>
                <ul>
                  <li>Cung cấp các dịch vụ đến Thành viên;</li>
                  <li>
                    Ngừa các hoạt động phá hủy tài khoản người dùng của thành viên hoặc
                    các hoạt động giả mạo Thành viên;
                  </li>
                  <li>
                    Liên lạc và giải quyết với thành viên trong những trường hợp đặc biệt.
                  </li>
                  <li>
                    Không sử dụng thông tin cá nhân của thành viên ngoài mục đích xác nhận
                    và liên hệ có liên quan đến hoạt động tại English For School.
                  </li>
                  <li>
                    Trong trường hợp có yêu cầu của pháp luật: Ứng dụng English For School có trách
                    nhiệm hợp tác cung cấp thông tin cá nhân thành viên khi có yêu cầu từ
                    cơ quan tư pháp bao gồm: Viện kiểm sát, tòa án, cơ quan công an điều
                    tra liên quan đến hành vi vi phạm pháp luật nào đó của khách hàng.
                    Ngoài ra, không ai có quyền xâm phạm vào thông tin cá nhân của thành
                    viên.
                  </li>
                </ul>
          
                <p class="font-weight-bold">3. Thời gian lưu trữ thông tin</p>
                <p>
                  Dữ liệu cá nhân của Thành viên sẽ được lưu trữ cho đến khi có yêu cầu
                  hủy bỏ hoặc tự thành viên đăng nhập và thực hiện hủy bỏ. Còn lại trong
                  mọi trường hợp thông tin cá nhân thành viên sẽ được bảo mật trên máy chủ
                  của English For School.
                </p>
          
                <p class="font-weight-bold">
                  4. Chính sách bảo mật thông tin cá nhân thành viên
                </p>
                <ul>
                  <li>
                    Thông tin cá nhân của thành viên trên English For School được English For School cam kết bảo
                    mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân của English For School
                    .Việc thu thập và sử dụng thông tin của mỗi thành viên chỉ được thực
                    hiện khi có sự đồng ý của thành viên đó trừ những trường hợp pháp luật
                    có quy định khác.
                  </li>
                  <li>
                    Không sử dụng, không chuyển giao, cung cấp hay tiết lộ cho bên thứ 3
                    nào về thông tin cá nhân của thành viên khi không có sự cho phép đồng
                    ý từ thành viên.
                  </li>
                  <li>
                    Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn đến
                    mất mát dữ liệu cá nhân thành viên, English For School sẽ có trách nhiệm thông
                    báo vụ việc cho cơ quan chức năng điều tra xử lý kịp thời và thông báo
                    cho thành viên được biết.
                  </li>
                  <li>
                    Bảo mật tuyệt đối mọi thông tin giao dịch trực tuyến của Thành viên
                    bao gồm thông tin hóa đơn kế toán chứng từ số hóa tại khu vực dữ liệu
                    trung tâm an toàn cấp 1 của English For School.
                  </li>
                  <li>
                    Ban quản trị English For School yêu cầu các cá nhân khi đăng ký là thành viên,
                    phải chịu trách nhiệm về tính pháp lý của những thông tin trên. Ban
                    quản trị English For School không chịu trách nhiệm cũng như không giải quyết mọi
                    khiếu nại có liên quan đến quyền lợi của Thành viên đó nếu xét thấy
                    tất cả thông tin cá nhân của thành viên đó cung cấp khi đăng ký ban
                    đầu là không chính xác.
                  </li>
                </ul>
          
                <h4>
                  Điều 10: Những rủi ro khi lưu trữ, trao đổi và chia sẻ thông tin trên
                  Internet
                </h4>
                <p>
                  Trên Website, phần mềm English For School xuất hiện link website, hoặc biểu tượng
                  website khác, bạn không nên suy luận rằng English For School kiểm soát hoặc sở hữu
                  với những website này. Việc truy cập tới các trang khác này hoàn toàn có
                  thể gặp rủi ro, nguy hiểm. Người Sử Dụng hoàn toàn chịu trách nhiệm rủi
                  ro khi sử dụng website liên kết này. English For School không chịu trách nhiệm về
                  nội dung của bất kì website hoặc điểm đến nào ngoài trang English For School.
                </p>
          
                <h4>
                  Điều 11: Hiệu lực của thỏa thuận.
                </h4>
          
                <p>
                  Các điều khoản quy định tại Thỏa Thuận này được quy định trên website có thể được cập nhật, chỉnh sửa bất cứ lúc nào mà không cần phải thông báo trước tới Người Sử Dụng. Chúng tôi sẽ công bố rõ trên Website, diễn đàn về những thay đổi, bổ sung đó.
                </p>
                <p>
                  Trong trường hợp một hoặc một số điều khoản Thỏa Thuận cung cấp và sử
                  dụng ứng dụng English For School này xung đột với các quy định của luật pháp Việt
                  Nam, điều khoản đó sẽ được chỉnh sửa cho phù hợp với quy định pháp luật
                  hiện hành, phần còn lại của Thỏa Thuận vẫn giữ nguyên giá trị.
                </p>
                <p>
                  Thỏa Thuận Sử Dụng English For School này được cập nhật và có giá trị từ ngày 10 tháng 03 năm 2020.
                </p>
              </div>
            </div>
          </body>
          </html>
                `,
          }}
          onMessage={() => {}}
        />
      </View>
    );
  }
}

export default PrivacyScreen;
