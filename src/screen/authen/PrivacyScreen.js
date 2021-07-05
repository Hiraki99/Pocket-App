import React from 'react';
import {WebView} from 'react-native-webview';
import {ActivityIndicator, Dimensions, View} from 'react-native';
import {useSelector} from 'react-redux';

import CommonHeader from '~/BaseComponent/components/layouts/CommonHeader';
import {translate} from '~/utils/multilanguage';

const WIDTH_DEVICE = Dimensions.get('screen').width;

const PrivacyScreen = () => {
  const language = useSelector((state) => state.config.language || 'vi');

  return (
    <View style={{flex: 1}}>
      <CommonHeader title={translate('Quy định bảo mật')} themeWhite />
      {language === 'vi' && (
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
            <div class="privacy-wrap" data-v-d35ae454="" data-v-3257719a=""><div class="privacy-header d-flex justify-content-center align-items-center" data-v-d35ae454=""></div> <div class="container mt-3 privacy-content" data-v-d35ae454=""><h2 data-v-d35ae454="">TERMS &amp; PRIVACY POLICY POCKET ENGLISH</h2> <h4 data-v-d35ae454="">Điều 1: Giải thích từ ngữ:</h4> <p data-v-d35ae454="">
      Thỏa Thuận: là bản Thỏa Thuận Cung Cấp Và Sử Dụng Ứng Dụng Pocket English này (sau đây gọi là Thỏa Thuận) cùng với tất cả các bản sửa đổi,
      bổ sung, cập nhật.
    </p> <p data-v-d35ae454="">Pocket English: là ứng dụng do chúng tôi là chủ quản.</p> <p data-v-d35ae454="">
      Thông Tin Cá Nhân: là thông tin gắn liền với việc xác định danh tính,
      nhân thân của cá nhân bao gồm tên, tuổi, địa chỉ, số chứng minh nhân
      dân, số điện thoại, địa chỉ thư điện tử, tài khoản ngân hàng của Người
      Sử Dụng và một số thông tin khác theo quy định của pháp luật.
    </p> <p data-v-d35ae454="">
      Người Sử Dụng: là chủ tài khoản, sở hữu, sử dụng hợp pháp tài khoản
      Pocket English.
    </p> <p data-v-d35ae454="">
      Sở Hữu Trí Tuệ: bao gồm quyền khởi kiện, quyền thiết kế, báo cáo, dữ
      liệu, cơ sở dữ liệu, công cụ, mã, ảnh, hình ảnh, video, giao diện, các
      trang web, thiết kế, văn bản, đồ họa, thông tin, phần mềm, các tệp âm
      thanh và các tệp media khác, các lựa chọn và cách sắp xếp chúng, tài
      liệu và tất cả các quyền sở hữu trí tuệ khác.
    </p> <h4 data-v-d35ae454="">Điều 2: Nội dung dịch vụ</h4> <p data-v-d35ae454="">
      Các dịch vụ của chúng tôi bao gồm nhiều nội dung và khóa học, được thiết
      kế để tạo điều kiện cho việc học các nội dung có sẵn trên ứng dụng,
      người dùng có thể sử dụng trên thiết bị di động, máy tính xách tay và /
      hoặc máy tính bảng hoặc bất kỳ thiết bị nào khác, dù đã được phát minh
      hay sắp được phát minh, theo đó bạn có thể truy cập nội dung và các khóa
      học của chúng tôi, được gọi là dịch vụ của chúng tôi cung cấp cho bạn.
    </p> <h4 data-v-d35ae454="">Điều 3: Chấp nhận điều khoản sử dụng và sửa đổi</h4> <p data-v-d35ae454="">
      Để truy cập và sử dụng Dịch vụ Pocket English , Người Sử Dụng phải
      đồng ý và tuân theo các điều khoản được quy định tại Thỏa thuận này và
      quy định.
    </p> <p data-v-d35ae454="">
      Khi truy cập, sử dụng Pocket English bằng bất cứ phương tiện (máy
      tính, điện thoại, máy tính bảng) thì Người Sử Dụng cũng phải tuân theo
      Quy chế này.
    </p> <p data-v-d35ae454="">
      Để đáp ứng nhu cầu sử dụng của Người Sử Dụng, Pocket English không
      ngừng hoàn thiện và phát triển, vì vậy các điều khoản quy định tại Thỏa
      thuận cung cấp và sử dụng ứng dụng Pocket English, sẽ công bố rõ
      trên Website, diễn đàn về những thay đổi, bổ sung đó.
    </p> <h4 data-v-d35ae454="">Điều 4: Đăng kí tài khoản và sử dụng dịch vụ.</h4> <p data-v-d35ae454="">
      Người Sử Dụng tự chịu trách nhiệm về năng lực hành vi trong việc đăng ký
      tài khoản và sử dụng Pocket English.
    </p> <p data-v-d35ae454="">
      Người Sử Dụng có thể đăng nhập Pocket English từ các tài khoản liên
      kết khác mà Pocket English cho phép.
    </p> <p data-v-d35ae454="">
      Sau khi Người Sử Dụng đăng nhập vào Pocket English, Người Sử Dụng có
      thể thay đổi tên thành viên. Tên thành viên phải tuân theo nội quy đặt
      tên theo quy định, không vi phạm những điều cấm của Thỏa thuận này. Tên
      thành viên sẽ được hiển thị trên ứng dụng Pocket English.
    </p> <p data-v-d35ae454="">
      Các tính năng của Pocket English yêu cầu Người Sử Dụng phải đăng ký,
      đăng nhập để sử dụng. Chúng tôi khuyến khích Người Sử Dụng đăng ký tài
      khoản để sử dụng Pocket English được tốt nhất.
    </p> <h4 data-v-d35ae454="">Điều 5: Các nội dung cấm trao đổi và chia sẻ trên ứng dụng</h4> <p data-v-d35ae454="">
      Khi sử dụng sản phẩm Pocket English, nghiêm cấm khách hàng một số
      hành vi bao gồm nhưng không giới hạn sau:
    </p> <p data-v-d35ae454="">
      Lợi dụng việc cung cấp, trao đổi, sử dụng thông tin trên Pocket English nhằm mục đích:
    </p> <ul data-v-d35ae454=""><li data-v-d35ae454="">
        Chống lại Nhà nước Cộng hoà xã hội chủ nghĩa Việt Nam; gây phương hại
        đến an ninh quốc gia, trật tự, an toàn xã hội; phá hoại khối đại đoàn
        kết toàn dân; tuyên truyền chiến tranh xâm lược, khủng bố; gây hận
        thù, mâu thuẫn giữa các dân tộc, sắc tộc, chủng tộc, tôn giáo;
      </li> <li data-v-d35ae454="">
        Tuyên truyền, kích động bạo lực, dâm ô, đồi trụy, tội ác, tệ nạn xã
        hội, mê tín dị đoan, phá hoại thuần phong, mỹ tục của dân tộc.
      </li> <li data-v-d35ae454="">
        Người Sử Dụng lợi dụng việc sử dụng Pocket English nhằm tiết lộ bí
        mật nhà nước, bí mật quân sự, an ninh, kinh tế, đối ngoại và những bí
        mật khác do pháp luật quy định bằng bất cứ hình thức nào trên Pocket English.
      </li> <li data-v-d35ae454="">
        Người Sử Dụng có quyền sử dụng đối với hình ảnh của mình. Khi sử dụng
        hình ảnh của cá nhân khác, Người Sử Dụng phải được sự đồng ý của cá
        nhân đó. Nghiêm cấm việc sử dụng hình ảnh của người khác mà xâm phạm
        danh dự, nhân phẩm, uy tín của người có hình ảnh.
      </li> <li data-v-d35ae454="">
        Lợi dụng ứng dụng Pocket English để thu thập thông tin của Người
        Sử Dụng, công bố thông tin, tư liệu về đời tư của Người Sử Dụng khác.
      </li> <li data-v-d35ae454="">
        Đặt thành viên theo tên của danh nhân, tên các vị lãnh đạo của Đảng và
        Nhà nước, tên của cá nhân, tổ chức tội phạm, phản động, khủng bố hoặc
        tài khoản có ý nghĩa không lành mạnh, trái với thuần phong mỹ tục.
      </li> <li data-v-d35ae454="">
        Đưa thông tin xuyên tạc, vu khống, nhạo báng, xúc phạm uy tín tới tổ
        chức, cá nhân dưới bất kỳ hình thức nào (nhạo báng, chê bai, kỳ thị
        tôn giáo, giới tính, sắc tộc….).
      </li> <li data-v-d35ae454="">
        Hành vi, thái độ làm tổn hại đến uy tín Pocket English dưới bất kỳ
        hình thức hoặc phương thức nào.
      </li> <li data-v-d35ae454="">
        Cản trở trái pháp luật, gây rối, phá hoại hệ thống máy chủ; Cản trở
        việc truy cập thông tin và sử dụng các dịch vụ hợp pháp trên English
        For School.
      </li> <li data-v-d35ae454="">
        Sử dụng trái phép mật khẩu, khoá mật mã của các tổ chức, cá nhân,
        thông tin riêng, thông tin cá nhân và tài nguyên Internet.
      </li> <li data-v-d35ae454="">
        Trực tiếp hoặc gián tiếp sử dụng bất kỳ thiết bị, phần mềm, trang web
        Internet, dịch vụ dựa trên web, hoặc các phương tiện khác để gỡ bỏ,
        thay đổi, bỏ qua, lẩn tránh, cản trở, hoặc phá hoại bất kỳ bản quyền,
        thương hiệu, hoặc các dấu hiệu về quyền sở hữu khác được đánh dấu trên
        Nội dung (như logo) hoặc bất kỳ hệ thống kiểm soát dữ liệu, thiết bị,
        biện pháp bảo vệ nội dung khác cũng như các biện pháp hạn chế truy cập
        từ các vùng địa lý khác nhau.
      </li> <li data-v-d35ae454="">
        Trực tiếp hoặc gián tiếp thông qua bất kỳ thiết bị, phần mềm, trang
        web Internet, dịch vụ dựa trên web, hoặc các phương tiện khác để sao
        chép, tải về, chụp lại, sản xuất lại, nhân bản, lưu trữ, phân phối,
        tải lên, xuất bản, sửa đổi, dịch thuật, phát sóng, trình chiếu, hiển
        thị, bán, truyền tải hoặc truyền lại nội dung trừ khi được sự cho phép
        của Pocket English bằng văn bản.
      </li> <li data-v-d35ae454="">
        Tạo ra, tái tạo, phân phối hay quảng cáo một chi tiết của bất kỳ nội
        dung trừ khi được phép của Pocket English. Bạn không được phép xây
        dựng mô hình kinh doanh sử dụng các Nội dung cho dù là có hoặc không
        vì lợi nhuận. Nội dung được đề cập tại Pocket English bao gồm
        nhưng không giới hạn bất kỳ văn bản, đồ họa, hình ảnh, bố trí, giao
        diện, biểu tượng, hình ảnh, tài liệu âm thanh và video, và ảnh tĩnh.
        Ngoài ra, chúng tôi nghiêm cấm việc tạo ra các sản phẩm phát sinh hoặc
        vật liệu có nguồn gốc từ hoặc dựa trên bất kì Nội dung nào bao gồm
        dựng phim, làm video tương tự, hình nền, chủ đề máy tính, thiệp chúc
        mừng, và hàng hóa, trừ khi nó được sự cho phép của Pocket English
        bằng văn bản.
      </li> <li data-v-d35ae454="">
        Giả mạo tổ chức, cá nhân và phát tán thông tin giả mạo, thông tin sai
        sự thật trên Pocket English xâm hại đến quyền và lợi ích hợp pháp
        của tổ chức, cá nhân.
      </li> <li data-v-d35ae454="">
        Tạo đường dẫn trái tới tên miền hợp pháp của tổ chức, cá nhân. Tạo,
        cài đặt, phát tán các phần mềm độc hại, vi rút máy tính; xâm nhập trái
        phép, chiếm quyền điều khiển hệ thống thông tin, tạo lập công cụ tấn
        công trên Internet.
      </li> <li data-v-d35ae454="">
        Tuyệt đối không sử dụng bất kỳ chương trình, công cụ hay hình thức nào
        khác để can thiệp vào Pocket English.
      </li> <li data-v-d35ae454="">
        Nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào
        nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của sản phẩm cung
        cấp hoặc hệ thống máy chủ Pocket English.
      </li> <li data-v-d35ae454="">
        Không được có bất kỳ hành vi nào nhằm đăng nhập trái phép hoặc tìm
        cách đăng nhập trái phép hoặc gây thiệt hại cho hệ thống máy chủ
        Pocket English.
      </li> <li data-v-d35ae454="">
        Nghiêm cấm mọi hành vi xâm phạm khác dưới mọi hình thức tới sản phẩm,
        tài sản và uy tín của Pocket English.
      </li></ul> <h4 data-v-d35ae454="">Điều 6: Quy tắc quản lí vi phạm của Người Sử Dụng</h4> <p class="font-weight-bold" data-v-d35ae454="">
      Nguyên tắc.
    </p> <p data-v-d35ae454="">
      Người Sử Dụng vi phạm thỏa thuận cung cấp và sử dụng phần mềm thì tùy
      theo mức độ nghiêm trọng của hành vi sẽ bị xử lý tương ứng.
    </p> <p data-v-d35ae454="">
      Trường hợp hành vi vi phạm của Người Sử Dụng chưa được quy định trong
      thỏa thuận này thì tùy vào tính chất, mức độ của hành vi vi phạm,
      Pocket English sẽ đơn phương, toàn quyền quyết định mức xử lý hợp
      lý.
    </p> <p class="font-weight-bold" data-v-d35ae454="">
      Các hình thức xử lý:
    </p> <p data-v-d35ae454="">
      Hình thức xử lý 1: Khóa tài khoản 7 ngày
    </p> <p data-v-d35ae454="">
      Hình thức xử lý 2: Khóa tài khoản 30 ngày
    </p> <p data-v-d35ae454="">
      Hình thức xử lý 3: Khóa tài khoản 120 ngày hoặc khóa tài khoản vĩnh
      viễn.
    </p> <p data-v-d35ae454="">
      Hình thức xử lý 3, khóa tài khoản 120 ngày hoặc khóa vĩnh viễn được áp
      dụng bao gồm nhưng không giới hạn đối với các hành vi sau:
    </p> <ul data-v-d35ae454=""><li data-v-d35ae454="">
        Người Sử Dụng có hành vi lợi dụng Pocket English nhằm chống phá
        nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam. Hành vi này bao gồm nhưng
        không giới hạn việc người dùng đặt tên thành viên cá nhân trong phòng
        cộng đồng trùng tên với các vĩ nhân, các vị anh hùng của dân tộc, các
        vị lãnh đạo của đảng và nhà nước, hoặc người dùng có sử dụng hình ảnh,
        video, phát ngôn… có chứa thông tin bàn luận về vấn đề chính trị hoặc
        tiết lộ bí mật nhà nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
      </li> <li data-v-d35ae454="">
        Lan truyền thông tin lừa đảo: Sử dụng văn bản, hình ảnh, âm thanh hoặc
        video có chứa thông tin lừa đảo: giả làm chính thức hoặc các tổ chức,
        cá nhân; gian lận, lừa đảo tài sản của người khác hoặc tài khoản
        Pocket English.
      </li> <li data-v-d35ae454="">
        Phá hoại hệ thống ứng dụng Pocket English: Thành viên lợi dụng
        việc sử dụng sản phẩm để xâm nhập vào hệ thống máy chủ nhằm phá hoại
        sản phẩm hoặc cản trở việc truy cập thông tin. Thành viên sử dụng công
        cụ kỹ thuật nhằm tăng điểm hoạt động.
      </li></ul> <p data-v-d35ae454="">
      Hình thức xử lý 2, khóa tài khoản 30 ngày được áp dụng bao gồm nhưng
      không giới hạn đối với các hành vi sau:
    </p> <ul data-v-d35ae454=""><li data-v-d35ae454="">
        Xâm phạm riêng tư: Sử dụng hình ảnh cá nhân của người khác, công khai
        những tư liệu cá nhân và những thông tin của khác như danh tính, địa
        chỉ, số điện thoại mà chưa được sự đồng ý và tiến hành gọi điện quấy
        nhiễu hoặc khích động người khác quấy nhiễu.
      </li> <li data-v-d35ae454="">
        Công kích người khác: Sử dụng hình ảnh, thông tin, âm thanh hoặc
        video, xúc phạm, đưa thông tin xuyên tạc, vu khống, nhạo bang, xúc
        phạm uy tín tới tổ chức, cá nhân.
      </li></ul> <p data-v-d35ae454="">
      Hình thức xử lý 1, khóa tài khoản 7 ngày được áp dụng bao gồm nhưng
      không giới hạn đối với các hành vi sau:
    </p> <p data-v-d35ae454="">
      Công kích, xuyên tạc, xúc phạm nhân phẩm các thành viên khác.
    </p> <h4 data-v-d35ae454="">Điều 7: Quyền và nghĩa vụ của người sử dụng Pocket English</h4> <p data-v-d35ae454="">
      Khi đăng ký tài khoản Pocket English, Người Sử Dụng được sử dụng một
      phần hoặc tất cả các dịch vụ trong sản phẩm Pocket English.
    </p> <p data-v-d35ae454="">
      Người Sử Dụng có trách nhiệm bảo mật thông tin tài khoản, nếu những
      thông tin trên bị tiết lộ dưới bất kỳ hình thức nào thì Người Sử Dụng
      phải chấp nhận những rủi ro phát sinh. chúng tôi sẽ căn cứ vào những
      thông tin hiện có trong tài khoản để làm căn cứ quyết định chủ sở hữu
      tài khoản nếu có tranh chấp và chúng tôi sẽ không chịu trách nhiệm về
      mọi tổn thất phát sinh.
    </p> <p data-v-d35ae454="">
      Người Sử Dụng được quyền thay đổi tên thành viên. Tuy nhiên việc đổi tên
      thành viên không vi phạm các điều khoản cấm về cách đặt tên tài khoản,
      thành viên.
    </p> <p data-v-d35ae454="">
      Người Sử Dụng đồng ý sẽ thông báo ngay cho chúng tôi về bất kỳ trường
      hợp nào sử dụng trái phép tài khoản và mật khẩu của bạn hoặc bất kỳ các
      hành động phá vỡ hệ thống bảo mật nào. Bạn cũng bảo đảm rằng, bạn luôn
      thoát tài khoản của mình sau mỗi lần sử dụng.
    </p> <p data-v-d35ae454="">
      Người Sử Dụng phải tuân thủ tuyệt đối quy định về các hành vi cấm, các
      nội dung trao đổi cung cấp thông tin được quy định trong quy chế này.
      Nếu vi phạm một hoặc nhiều hành vi, tùy thuộc vào mức độ vi phạm chúng
      tôi sẽ khóa tài khoản vĩnh viễn, tước bỏ mọi quyền lợi của bạn đối các
      sản phẩm của chúng tôi và sẽ yêu cầu cơ quan chức năng truy tố bạn trước
      pháp luật nếu cần thiết.
    </p> <p data-v-d35ae454="">
      Thực hiện quyền và trách nhiệm khác theo quy định pháp luật.
    </p> <h4 data-v-d35ae454="">Điều 8: Bản quyền và quy trình báo cáo vi phạm bản quyền</h4> <p data-v-d35ae454="">
      Tất cả quyền sở hữu trí tuệ tồn tại trong Pocket English đều thuộc
      về chúng tôi hoặc được cấp phép hợp pháp cho chúng tôi sử dụng, theo đó,
      tất cả các quyền hợp pháp đều được đảm bảo. Trừ khi được sự đồng ý của
      chúng tôi, Người Sử Dụng không được phép sử dụng, sao chép, xuất bản,
      tái sản xuất, truyền hoặc phân phát bằng bất cứ hình thức nào, bất cứ
      thành phần nào các quyền sở hữu trí tuệ đối với sản phẩm Pocket English.
    </p> <p data-v-d35ae454="">
      Chúng tôi có toàn quyền, bao gồm nhưng không giới hạn trong các quyền
      tác giả, thương hiệu, bí mật kinh doanh, nhãn hiệu và các quyền sở hữu
      trí tuệ khác trong sản phẩm Pocket English của chúng tôi. Việc sử
      dụng quyền và sở hữu của chúng tôi cần phải được chúng tôi cho phép
      trước bằng văn bản. Ngoài việc được cấp phép bằng văn bản, chúng tôi
      không cấp phép dưới bất kỳ hình thức nào khác cho dù đó là hình thức
      công bố hay hàm ý để bạn thực hiện các quyền trên. Và do vậy, Người Sử
      Dụng không có quyền sử dụng sản phẩm của chúng tôi vào mục đích thương
      mại mà không có sự cho phép bằng văn bản của chúng tôi trước đó.
    </p> <h4 data-v-d35ae454="">
      Điều 9: Thu thập thông tin cá nhân và chính sách bảo vệ thông tin các
      nhân, thông tin riêng của người sử dụng dịch vụ ứng dụng.
    </h4> <p data-v-d35ae454="">
      Để đảm bảo phục vụ và cung cấp tới người sử dụng các dịch vụ ngày càng
      tốt hơn và thực hiện việc cung cấp cho các cơ quan chức năng có thẩm
      quyền khi có yêu cầu, Pocket English sẽ tiến hành thu thập dữ liệu
      của người sử dụng bao gồm: họ tên, số điện thoại, email, tên đăng nhập,
      mật khẩu đăng nhập.
    </p> <p class="font-weight-bold" data-v-d35ae454="">1. Mục đích và phạm vi thu thập</p> <p data-v-d35ae454="">
      Việc thu thập dữ liệu chủ yếu trên ứng dụng Pocket English bao gồm:
      họ tên, số điện thoại, email, tên đăng nhập, mật khẩu đăng nhập. Đây là
      các thông tin mà Pocket English cần thành viên cung cấp bắt buộc khi
      đăng ký sử dụng dịch vụ và để Pocket English liên hệ xác nhận khi
      thành viên đăng ký sử dụng dịch vụ trên website nhằm đảm bảo quyền lợi
      cho chính các thành viên.
    </p> <p data-v-d35ae454="">
      Các thành viên sẽ tự chịu trách nhiệm về bảo mật và lưu giữ mọi hoạt
      động sử dụng dịch vụ dưới tên đăng ký, mật khẩu và hộp thư điện tử của
      mình. Ngoài ra, thành viên có trách nhiệm thông báo kịp thời cho ứng
      dụng Pocket English về những hành vi sử dụng trái phép, lạm dụng, vi
      phạm bảo mật, lưu giữ tên đăng ký và mật khẩu của bên thứ ba để có biện
      pháp giải quyết phù hợp.
    </p> <p class="font-weight-bold" data-v-d35ae454="">2. Phạm vi sử dụng thông tin</p> <p data-v-d35ae454="">
      Ứng dụng Pocket English sử dụng thông tin thành viên cung cấp để:
    </p> <ul data-v-d35ae454=""><li data-v-d35ae454="">Cung cấp các dịch vụ đến Thành viên;</li> <li data-v-d35ae454="">
        Ngừa các hoạt động phá hủy tài khoản người dùng của thành viên hoặc
        các hoạt động giả mạo Thành viên;
      </li> <li data-v-d35ae454="">
        Liên lạc và giải quyết với thành viên trong những trường hợp đặc biệt.
      </li> <li data-v-d35ae454="">
        Không sử dụng thông tin cá nhân của thành viên ngoài mục đích xác nhận
        và liên hệ có liên quan đến hoạt động tại Pocket English.
      </li> <li data-v-d35ae454="">
        Trong trường hợp có yêu cầu của pháp luật: Ứng dụng Pocket English
        có trách nhiệm hợp tác cung cấp thông tin cá nhân thành viên khi có
        yêu cầu từ cơ quan tư pháp bao gồm: Viện kiểm sát, tòa án, cơ quan
        công an điều tra liên quan đến hành vi vi phạm pháp luật nào đó của
        khách hàng. Ngoài ra, không ai có quyền xâm phạm vào thông tin cá nhân
        của thành viên.
      </li></ul> <p class="font-weight-bold" data-v-d35ae454="">3. Thời gian lưu trữ thông tin</p> <p data-v-d35ae454="">
      Dữ liệu cá nhân của Thành viên sẽ được lưu trữ cho đến khi có yêu cầu
      hủy bỏ hoặc tự thành viên đăng nhập và thực hiện hủy bỏ. Còn lại trong
      mọi trường hợp thông tin cá nhân thành viên sẽ được bảo mật trên máy chủ
      của Pocket English.
    </p> <p class="font-weight-bold" data-v-d35ae454="">
      4. Chính sách bảo mật thông tin cá nhân thành viên
    </p> <ul data-v-d35ae454=""><li data-v-d35ae454="">
        Thông tin cá nhân của thành viên trên Pocket English được Pocket English cam kết bảo mật tuyệt đối theo chính sách bảo vệ thông tin
        cá nhân của Pocket English .Việc thu thập và sử dụng thông tin của
        mỗi thành viên chỉ được thực hiện khi có sự đồng ý của thành viên đó
        trừ những trường hợp pháp luật có quy định khác.
      </li> <li data-v-d35ae454="">
        Không sử dụng, không chuyển giao, cung cấp hay tiết lộ cho bên thứ 3
        nào về thông tin cá nhân của thành viên khi không có sự cho phép đồng
        ý từ thành viên.
      </li> <li data-v-d35ae454="">
        Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn đến
        mất mát dữ liệu cá nhân thành viên, Pocket English sẽ có trách
        nhiệm thông báo vụ việc cho cơ quan chức năng điều tra xử lý kịp thời
        và thông báo cho thành viên được biết.
      </li> <li data-v-d35ae454="">
        Bảo mật tuyệt đối mọi thông tin giao dịch trực tuyến của Thành viên
        bao gồm thông tin hóa đơn kế toán chứng từ số hóa tại khu vực dữ liệu
        trung tâm an toàn cấp 1 của Pocket English.
      </li> <li data-v-d35ae454="">
        Ban quản trị Pocket English yêu cầu các cá nhân khi đăng ký là
        thành viên, phải chịu trách nhiệm về tính pháp lý của những thông tin
        trên. Ban quản trị Pocket English không chịu trách nhiệm cũng như
        không giải quyết mọi khiếu nại có liên quan đến quyền lợi của Thành
        viên đó nếu xét thấy tất cả thông tin cá nhân của thành viên đó cung
        cấp khi đăng ký ban đầu là không chính xác.
      </li></ul> <h4 data-v-d35ae454="">
      Điều 10: Những rủi ro khi lưu trữ, trao đổi và chia sẻ thông tin trên
      Internet
    </h4> <p data-v-d35ae454="">
      Trên Website, phần mềm Pocket English xuất hiện link website, hoặc
      biểu tượng website khác, bạn không nên suy luận rằng Pocket English
      kiểm soát hoặc sở hữu với những website này. Việc truy cập tới các trang
      khác này hoàn toàn có thể gặp rủi ro, nguy hiểm. Người Sử Dụng hoàn toàn
      chịu trách nhiệm rủi ro khi sử dụng website liên kết này. Pocket English không chịu trách nhiệm về nội dung của bất kì website hoặc điểm
      đến nào ngoài trang Pocket English.
    </p> <h4 data-v-d35ae454="">
      Điều 11: Hiệu lực của thỏa thuận.
    </h4> <p data-v-d35ae454="">
      Các điều khoản quy định tại Thỏa Thuận này được quy định trên website có
      thể được cập nhật, chỉnh sửa bất cứ lúc nào mà không cần phải thông báo
      trước tới Người Sử Dụng. chúng tôi sẽ công bố rõ trên Website, diễn đàn
      về những thay đổi, bổ sung đó.
    </p> <p data-v-d35ae454="">
      Trong trường hợp một hoặc một số điều khoản Thỏa Thuận cung cấp và sử
      dụng ứng dụng Pocket English này xung đột với các quy định của luật
      pháp Việt Nam, điều khoản đó sẽ được chỉnh sửa cho phù hợp với quy định
      pháp luật hiện hành, phần còn lại của Thỏa Thuận vẫn giữ nguyên giá trị.
    </p> <p data-v-d35ae454="">
      Thỏa Thuận Sử Dụng Pocket English này được cập nhật và có giá trị từ
      ngày 11 tháng 09 năm 2019.
    </p></div></div>
          </body>
          </html>
                `,
          }}
          onMessage={() => {}}
        />
      )}
      {language === 'en' && (
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
            <div class="privacy-wrap" data-v-dcda9c7a="" data-v-3257719a=""><div class="privacy-header d-flex justify-content-center align-items-center" data-v-dcda9c7a=""></div> <div class="container mt-3 privacy-content" data-v-dcda9c7a=""><h2 data-v-dcda9c7a="">TERMS &amp; PRIVACY POLICY POCKET ENGLISH</h2> <h4 data-v-dcda9c7a="">Article 1: Interpretation of terms:</h4> <p data-v-dcda9c7a="">
      Agreement: a supply and use agreement for this Pocket English Application (hereinafter referred to as the Agreement) together with all amendments, supplements and updates.
    </p> <p data-v-dcda9c7a="">Pocket English: is an application owned by us.</p> <p data-v-dcda9c7a="">
      Personal Information: the information associated with identifying identity of an individual, including name, age, address, identity card number, phone number, email address, user’s bank account and some other information as regulated by law.
    </p> <p data-v-dcda9c7a="">
      User: is the account holder, owns and legally uses the Pocket English account.
    </p> <p data-v-dcda9c7a="">
      Intellectual Property: includes rights to file a lawsuit, design rights, reports, data, databases, tools, code, photos, images, videos, interfaces, web pages, designs, text, graphics, information, software, audio and other media files, selections and their arrangements, documents and all other intellectual property rights.
    </p> <h4 data-v-dcda9c7a="">Article 2: Content services</h4> <p data-v-dcda9c7a="">
      Our services include a variety of content and courses, designed to facilitate learning of the content available on the app, which users can use on mobile devices, laptops and/or tablets or any other device, invented or soon to be invented, by which you can access our content and courses, known as the services we offer you.
    </p> <h4 data-v-dcda9c7a="">Article 3: Accept the terms of use and modification</h4> <p data-v-dcda9c7a="">
      In order to access and use the Pocket English Service, the User must agree to and abide by the terms set forth in this Agreement and the regulations.
    </p> <p data-v-dcda9c7a="">
      When accessing and using Pocket English by any means (computer, phone, tablet), the User must also comply with this Regulation.
    </p> <p data-v-dcda9c7a="">
      In order to meet the user's needs, Pocket English is constantly improving and developing, so the terms specified in the Agreement on providing and using Pocket English application will announce about those changes and additions on the Website.
    </p> <h4 data-v-dcda9c7a="">Article 4: Account registration and service use.</h4> <p data-v-dcda9c7a="">
      Users are solely responsible for their ability to act in registering account and using Pocket English.
    </p> <p data-v-dcda9c7a="">
      The User may log in to Pocket English from other linked accounts which are allowed by Pocket English.
    </p> <p data-v-dcda9c7a="">
      After logging in to Pocket English, the User can change the member's name. The member's name must comply with the naming rules as prescribed, not violating the prohibitions of this Agreement. The member's name will be displayed on the Pocket English app.
    </p> <p data-v-dcda9c7a="">
      The features of Pocket English require Users to register, log in to use. We encourage Users to register an account to experience Pocket English with high efficiency.
    </p> <h4 data-v-dcda9c7a="">Article 5: Prohibited content on the application</h4> <p data-v-dcda9c7a="">
      When using Pocket English products, it is strictly forbidden for customers to perform certain acts including but not limited to the following:
    </p> <p data-v-dcda9c7a="">
      Taking advantage of the provision, exchange and use of information on Pocket English for the purpose of:
    </p> <ul data-v-dcda9c7a=""><li data-v-dcda9c7a="">
        Against the State of the Socialist Republic of Vietnam; causing harm to national security, social order and safety; undermining the great unity of the whole people; propagandising wars of aggression and terrorism; causing hatred and conflict among peoples, ethnicities, races and religions;
      </li> <li data-v-dcda9c7a="">
        Promoting, inciting violence, lewdness, debauchery, crimes, social evils, superstition, destructroying nation's fine customs and traditions.
      </li> <li data-v-dcda9c7a="">
        Users take advantage of the use of Pocket English to disclose state secrets, military secrets, security, economic, foreign affairs and other prohibited information prescribed by law in any form through Pocket English.
      </li> <li data-v-dcda9c7a="">
        The User has the right to use their own images. When using the image of another individual, the User must obtain the consent of that individual. It is strictly forbidden to use images of other people that infringe upon their honor, dignity and reputation.
      </li> <li data-v-dcda9c7a="">
        Taking advantage of Pocket English application to collect User's information, publish information and documents about other Users' private life.
      </li> <li data-v-dcda9c7a="">
        Setting account names after famous people, leaders of the Party and State, criminal individuals or organizations, reactionaries, terrorists or accounts with unhealthy meanings, contrary to pure aesthetics custom
      </li> <li data-v-dcda9c7a="">
        Disseminating information that distorts, slanders, ridicules or damages reputation to organizations and individuals in any form (mocking, disparaging, discriminating against religion, gender, ethnicity...).
      </li> <li data-v-dcda9c7a="">
        Acts and attitudes that damage the reputation of Pocket English in any form or manner.
      </li> <li data-v-dcda9c7a="">
        Illegally obstructing, disrupting or sabotaging the server system; obstructing access to information and legitimate use of services on Pocket English.
      </li> <li data-v-dcda9c7a="">
        Unauthorized use of passwords, cryptographic keys of organizations and individuals, private information, personal information and Internet resources.
      </li> <li data-v-dcda9c7a="">
        Using directly or indirectly any device, software, Internet website, web-based service, or other means to remove, alter, bypass, circumvent, obstruct, or destroy any copyrights, trademarks, or other insignias of ownership marked on the Content (such as logos) or any data controls, devices, other content protection measures, and other restrictions on access from different geographical regions.
      </li> <li data-v-dcda9c7a="">
        Directly or indirectly through any device, software, Internet website, web-based service, or other means to copy, download, capture, reproduce, duplicate, store, distribute, upload, publish, modify, translate, broadcast, display, present, sell, transmit or retransmit the Content without the written permission of Pocket English.
      </li> <li data-v-dcda9c7a="">
        Creating, reproducing, distributing or advertising an element of any content except with the permission of Pocket English. You are not permitted to build a business model using the Contents whether or not for profit. Content covered at Pocket English includes but is not limited to any text, graphics, images, layouts, interfaces, icons, images, audio and video materials, and still images. In addition, the creation of derivative works or materials derived from or based on any Content is strictly prohibited including montages, similar videos, wallpapers, desktop themes, greeting cards and more. greetings, and merchandise, unless it is authorized by Pocket English in writing.
      </li> <li data-v-dcda9c7a="">
        Forging organizations and individuals and spreading fake and untrue information on Pocket English infringes upon the legitimate rights and interests of organizations and individuals.
      </li> <li data-v-dcda9c7a="">
        Creating a left path to a legitimate domain name of an organization or individual. Creating, installing, and distributing malware and computer viruses; illegally infiltrating, gaining control of information systems, creating attack tools on the Internet.
      </li> <li data-v-dcda9c7a="">
        Absolutely prohibited from using any program, tool or other methods to interfere with Pocket English.
      </li> <li data-v-dcda9c7a="">
        It is strictly forbidden to distribute, propagate or promote any activities aimed at interfering, destroying or infiltrating the data of the product provided or the Pocket English server system.
      </li> <li data-v-dcda9c7a="">
        Must not engage in any illegal login attempts or attempt to log in illegally or cause damage to the Pocket English server system.
      </li> <li data-v-dcda9c7a="">
        Any other infringing acts of any kind to Pocket English's products, property and reputation are strictly prohibited.
      </li></ul> <h4 data-v-dcda9c7a="">Article 6: User's Violations Management Rules</h4> <p class="font-weight-bold" data-v-dcda9c7a="">
      Rule:
    </p> <p data-v-dcda9c7a="">
      Users who violate the agreement to provide and use software, depending on the seriousness of their behavior, will be handled accordingly.
    </p> <p data-v-dcda9c7a="">
      In case the user's violation is not specified in this agreement, depending on the nature and severity of the violation, Pocket English will unilaterally and completely decide on a reasonable level of handling.
    </p> <p class="font-weight-bold" data-v-dcda9c7a="">
      Handling methods:
    </p> <p data-v-dcda9c7a="">
      Handling method 1: Account lockout for 7 days
    </p> <p data-v-dcda9c7a="">
      Handling method 2: Account lockout for 30 days
    </p> <p data-v-dcda9c7a="">
      Handling method 3: Account lockout for 120 days or permanently
    </p> <p data-v-dcda9c7a="">
      Handling method 3, account lockout for 120 days or permanently is applied including but not limited to the following acts:
    </p> <ul data-v-dcda9c7a=""><li data-v-dcda9c7a="">
        The user has taken advantage of Pocket English to sabotage the Socialist Republic of Vietnam. This behavior includes but is not limited to users naming individual members in the community room with the same names as great people, national heroes, leaders of the party and state, or users using images, videos, statements... containing information discussing political issues or disclosing state secrets of the Socialist Republic of Vietnam.
      </li> <li data-v-dcda9c7a="">
        Spreading deceptive information: Using text, images, audio or video containing deceptive information: pretending to be an official agency or organizations or individuals; fraud, defrauding someone else's property or Pocket English account.
      </li> <li data-v-dcda9c7a="">
        Vandalizing the Pocket English application system: Users take advantage of the use of the product to infiltrate the server system to destroy the product or obstruct access to information. Users use technical tools to increase activity points.
      </li></ul> <p data-v-dcda9c7a="">
      Handling method 2, account lockout for 30 days is applied including but not limited to the following acts:
    </p> <ul data-v-dcda9c7a=""><li data-v-dcda9c7a="">
        Invasion of privacy: Using other people's personal photos, publicizing personal documents and other people's information such as identity, address, phone number without consent and making calls harassing or inciting others to harass.
      </li> <li data-v-dcda9c7a="">
        Attacking others: Using offensive images, information, audio or video, giving information that distorts, slanders, ridicules, or insults the reputation of organizations and individuals.
      </li></ul> <p data-v-dcda9c7a="">
      Handling method 1, account lockout for 7 days is applied including but not limited to the following acts:
    </p> <p data-v-dcda9c7a="">
      Attacking, distorting or insulting the dignity of other members.
    </p> <h4 data-v-dcda9c7a="">Article 7: Rights and obligations of users of Pocket English</h4> <p data-v-dcda9c7a="">
      When registering a Pocket English account, the user can use a part or all of the services in the Pocket English product.
    </p> <p data-v-dcda9c7a="">
      The user is responsible for the confidentiality of the account information, if the above information is disclosed in any way, the user must accept the arising risks. We will base on the existing information in the account as a basis for deciding the account owner if there is a dispute and will not be responsible for any losses incurred.
    </p> <p data-v-dcda9c7a="">
      The user has the right to change the member's name. However, changing a member's name must not violate the prohibition on naming accounts and members.
    </p> <p data-v-dcda9c7a="">
      The user agrees to promptly notify us of any unauthorized use of your account and password or any other breach of security. You also warrant that you always log out of your account after each use.
    </p> <p data-v-dcda9c7a="">
      The user must strictly comply with the regulations on prohibited acts and information exchange contents specified in this regulation. If you violate one or more acts, depending on the severity of the violation, we will permanently lock your account, take away all your rights to our products and will ask the authorities to prosecute you before the law if necessary.
    </p> <p data-v-dcda9c7a="">
      Exercise other rights and responsibilities as prescribed by law.
    </p> <h4 data-v-dcda9c7a="">Article 8: Copyright and Copyright Infringement Reporting Process</h4> <p data-v-dcda9c7a="">
      All intellectual property rights existing in Pocket English belong to us or are legally licensed for our use, whereby all legal rights are guaranteed. Except with our consent, the user may not use, copy, publish, reproduce, disseminate or distribute in any way, any part of the intellectual property rights for the Pocket English product.
    </p> <p data-v-dcda9c7a="">
      We reserve all rights, including but not limited to the copyright, brand, trade secret, trademark and other intellectual property rights in our Pocket English products. The use of our rights and property requires our prior written permission. We do not grant any other license, express or implied, for you to exercise the above rights, other than expressly granted in writing. And therefore, the user has no right to use our product for commercial purposes without our prior written permission.
    </p> <h4 data-v-dcda9c7a="">
      Article 9: Personal information collection and personal information protection policy, private information of application service users.
    </h4> <p data-v-dcda9c7a="">
      To ensure providing users with better services and to provide information to the competent authorities upon request, Pocket English will collect user data including: full name, phone number, email, login name, login password.
    </p> <p class="font-weight-bold" data-v-dcda9c7a="">1. Purpose and scope of collection</p> <p data-v-dcda9c7a="">
      The main data collection on Pocket English application includes: full name, phone number, email, username, login password. This is the compulsory information that Pocket English needs members to provide when registering to use the service and for Pocket English to contact to confirm when members register to use the service on the website to ensure the interests of members themselves.
    </p> <p data-v-dcda9c7a="">
      Members will be solely responsible for the security and storage of all service use activities under their registered name, password and email box. In addition, members are responsible for promptly notifying the Pocket English application of unauthorized use, abuse, security breaches, retention of registration names and passwords of third parties for a suitable solution.
    </p> <p class="font-weight-bold" data-v-dcda9c7a="">2. Scope of information use</p> <p data-v-dcda9c7a="">
      The Pocket English app uses the information members provide to:
    </p> <ul data-v-dcda9c7a=""><li data-v-dcda9c7a="">Provide services to members;</li> <li data-v-dcda9c7a="">
        Prevent activities that destroy a member's user account or activities that impersonate a member;
      </li> <li data-v-dcda9c7a="">
        Contact and deal with members in special cases.
      </li> <li data-v-dcda9c7a="">
        Do not use members' personal information other than for confirmation and contact purposes related to activities at Pocket English.
      </li> <li data-v-dcda9c7a="">
        In case of legal requirements: Pocket English application is responsible for cooperating in providing member's personal information upon request from judicial authorities, including Procuracy, courts, investigative police agencies, related to a customer's illegal behavior. Besides, no one has the right to infringe on members' personal information.
      </li></ul> <p class="font-weight-bold" data-v-dcda9c7a="">3. Information storage time</p> <p data-v-dcda9c7a="">
      The members’ personal data will be stored until there is a request to cancel, or members themselves log in and make cancellations. In all other cases, members’ personal information will be kept confidential on Pocket English's server.
    </p> <p class="font-weight-bold" data-v-dcda9c7a="">
      4. Privacy policy of members' personal information
    </p> <ul data-v-dcda9c7a=""><li data-v-dcda9c7a="">
        Personal information of members on Pocket English is absolutely guaranteed by Pocket English according to Pocket English's personal information protection policy. The collection and use of information of each member is only done with the consent of that member, unless otherwise provided for by law.
      </li> <li data-v-dcda9c7a="">
        Do not use, transfer, provide or disclose to any third party a member's personal information without the permission and consent of that member.
      </li> <li data-v-dcda9c7a="">
        In the event that the information server is attacked by a hacker leading to the loss of member's personal data, Pocket English will be responsible for notifying the incident to the investigating authorities for timely handling and let members know.
      </li> <li data-v-dcda9c7a="">
        Absolutely keep all member's online transaction information confidential, including accounting invoices and digitized vouchers at the level 1 secure central data area of Pocket English.
      </li> <li data-v-dcda9c7a="">
        Pocket English administration requires individuals to be responsible for the legality of the information provided when registering as a member. The Pocket English administration is not responsible for and will not settle any complaints related to the interests of the member if it considers all the personal information provided by that member when registering to be incorrect.
      </li></ul> <h4 data-v-dcda9c7a="">
      Article 10: Risks of storing, exchanging and sharing information on the Internet
    </h4> <p data-v-dcda9c7a="">
      When another website link or icon appears on the Pocket English website or software, users should not infer that Pocket English controls or owns these websites. Accessing to these other sites is completely risky and dangerous. The user is solely responsible for the risk when accessing this linked website. Pocket English is not responsible for the content of any website or destination other than the Pocket English site.
    </p> <h4 data-v-dcda9c7a="">
      Article 11: Effect of the agreement
    </h4> <p data-v-dcda9c7a="">
      The terms in this Agreement are set forth on the website and may be updated or modified at any time without prior notice to the User. We will clearly announce on the website and the forum about those changes and additions.
    </p> <p data-v-dcda9c7a="">
      In the event that one or more of the terms of this Agreement for the provision and use of this Pocket English application conflict with the provisions of the laws of Vietnam, such terms will be modified to be consistent with the provisions of the applicable law, and the remainder of the Agreement will remain in full force and effect.
    </p> <p data-v-dcda9c7a="">
      This Pocket English Usage Agreement is up to date and valid from June 28, 2021.
    </p></div></div>
          </body>
          </html>
                `,
          }}
          onMessage={() => {}}
        />
      )}
    </View>
  );
};

export default PrivacyScreen;
