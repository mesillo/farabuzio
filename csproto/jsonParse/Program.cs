using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace jsonParse
{
    class Program
    {
        public class Message
    {
        [JsonProperty("parameters", NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> Parameters { get; set; }
    }
        static void Main(string[] args)
        {
            string message = "{\"parameters\":{\"startDateTimeUtc\":\"2020-02-08T00:00:00.000Z\",\"numberOfSeconds\":\"10\",\"forwardVideoUrl\":\"https://s3-bucket--development-r-videoplatform-media-storage.s3.eu-west-1.amazonaws.com/1/SN10000000009/videos/2020-06-17/daf81fca6a914ae6a077fcde3dd804f9/20200608-181900-1.mp4?X-Amz-Expires=600&x-amz-security-token=FwoGZXIvYXdzEHEaDM%2BmjiEzIdOOwmDXLiLfA3wD8kb8S0vwlumVfB2JoIi3iGF9pLX7TC3xs3wSA%2BcO8mwzKA2V9k5NHsNItCUgGFd9xsm7qVnB1BkEgxb%2BCnAetzlMq2xmbZWDXqXpzA8KkZYctpeiaFijIJOcIQv4ZQbIn1FUkyQpqRgG%2Bm40t9YnxQem3U0eBnQNictWWW0Yfia06vyHBq672nYsNQMeansBX5MINhN%2FmEIWS3%2BPpcFGGlwf1%2FuUJMoY9NJbM0RjGOkBnKS%2BDD05g%2F4WxnXCdyngnzpQXofVU7l29ZAX6QRtKuzbiIzbQAt0Q3AbeoSI6hPL7Pz22GpcjTBkntjzP6ox3jS%2Fv6eU4QD%2FW3xVJI9vpbyTomWTBtawP2s26vVDHQKmrEzzkirO8pQyAXe0WicuPw2IPexjHPAEX7D0YO8vhl4oknIV6dqCkwmoYgkpbNiMkGVCn3VXCQ5k%2Bdks7KkfcqZfYIqwG19krsP0Gg6F5jTiQJLX6tPYFUoN5TLluApP2K3L8L733HLW9FA4EjQ3lckYxI726EgvhoasU%2FFicr8g%2FOClrRYfPoSWrjH2bn5rvuwwFo%2Fkz125DCJftNWb6qbO8%2Bv%2BHI08AAMW0RE09n9w9ZyrS8vUtcWnaBqgu8KOZ50R9IKPzgcrQdTtKJvyqPcFMjmA0uVDds4Jdc6mgUUxtnRTco6tiGBNmInPGyb5aczkPHw8qBVEnKKi9KQpeUeave1wkFuW4BjlZEU%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAUX54OILQJZIKKMF6/20200617/eu-west-1/s3/aws4_request&X-Amz-Date=20200617T164516Z&X-Amz-SignedHeaders=host;x-amz-security-token&X-Amz-Signature=b5a5d448195e5479de0b78aa5fb05e03d02a3ac61bf2c2058cea03ca155d182c\",\"forwardSnapshotUrl\":\"https://s3-bucket--development-r-videoplatform-media-storage.s3.eu-west-1.amazonaws.com/1/SN10000000009/videos/2020-06-17/daf81fca6a914ae6a077fcde3dd804f9/20200608-181900-1.jpg?X-Amz-Expires=600&x-amz-security-token=FwoGZXIvYXdzEHEaDM%2BmjiEzIdOOwmDXLiLfA3wD8kb8S0vwlumVfB2JoIi3iGF9pLX7TC3xs3wSA%2BcO8mwzKA2V9k5NHsNItCUgGFd9xsm7qVnB1BkEgxb%2BCnAetzlMq2xmbZWDXqXpzA8KkZYctpeiaFijIJOcIQv4ZQbIn1FUkyQpqRgG%2Bm40t9YnxQem3U0eBnQNictWWW0Yfia06vyHBq672nYsNQMeansBX5MINhN%2FmEIWS3%2BPpcFGGlwf1%2FuUJMoY9NJbM0RjGOkBnKS%2BDD05g%2F4WxnXCdyngnzpQXofVU7l29ZAX6QRtKuzbiIzbQAt0Q3AbeoSI6hPL7Pz22GpcjTBkntjzP6ox3jS%2Fv6eU4QD%2FW3xVJI9vpbyTomWTBtawP2s26vVDHQKmrEzzkirO8pQyAXe0WicuPw2IPexjHPAEX7D0YO8vhl4oknIV6dqCkwmoYgkpbNiMkGVCn3VXCQ5k%2Bdks7KkfcqZfYIqwG19krsP0Gg6F5jTiQJLX6tPYFUoN5TLluApP2K3L8L733HLW9FA4EjQ3lckYxI726EgvhoasU%2FFicr8g%2FOClrRYfPoSWrjH2bn5rvuwwFo%2Fkz125DCJftNWb6qbO8%2Bv%2BHI08AAMW0RE09n9w9ZyrS8vUtcWnaBqgu8KOZ50R9IKPzgcrQdTtKJvyqPcFMjmA0uVDds4Jdc6mgUUxtnRTco6tiGBNmInPGyb5aczkPHw8qBVEnKKi9KQpeUeave1wkFuW4BjlZEU%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAUX54OILQJZIKKMF6/20200617/eu-west-1/s3/aws4_request&X-Amz-Date=20200617T164516Z&X-Amz-SignedHeaders=host;x-amz-security-token&X-Amz-Signature=556e9ed8e7030549f3c2d672a840075771d2409f703969280e8261f84ae0e9eb\"}}";
            //var json = JObject.Parse( message );
            var json = JToken.Parse( message );
            //Console.WriteLine( json );
            var parsedMessage = json.ToObject<Message>();
            //var parsedMessage = JsonConvert.DeserializeObject<Message>( message );
            Console.WriteLine( parsedMessage );
        }
    }
}
