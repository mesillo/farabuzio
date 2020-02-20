using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace testJson
{
    class Program
    {
        static void Main(string[] args)
        {
            runTestJson( "{\"dateTimeUTC\":\"2020-02-20T20:07:22.485Z\"}" );
        }

        private static void runTestJson( string jsonStr )
        {
            JObject jsonObject = JObject.Parse(jsonStr);
            JsonSerializer jsonSerializer = new JsonSerializer();
            
            jsonSerializer.DateParseHandling = DateParseHandling.None;
            //jsonSerializer.DateFormatHandling = DateFormatHandling.IsoDateFormat;
            //jsonSerializer.DateFormatString = "dd MM YYYY hh:mm";
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            { DateParseHandling = DateParseHandling.None, Formatting = Formatting.None };
            //Dictionary<string, string> jsonDictionary = jsonObject.ToObject<Dictionary<string, string>>( jsonSerializer );
            Dictionary<string, string> jsonDictionary = jsonObject.ToObject<Dictionary<string, string>>( jsonSerializer );
            foreach( KeyValuePair<string, string> kvp in jsonDictionary )
            {
                Console.WriteLine("Key = {0}, Value = {1}", kvp.Key, kvp.Value);
            }
            //Console.WriteLine( jsonDictionary );
        }
    }
}
