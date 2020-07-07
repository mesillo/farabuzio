using System;
using System.Text;

namespace testbuffers
{
    class Program
    {
        protected const ushort UuidLen = 36;
        static void Main(string[] args)
        {
            string hexStr = "AFFEEDDBBAA99887766554433221100FF";
            byte[] outBuffer = Encoding.ASCII.GetBytes(hexStr);
            
            for( int i = 0 ; i < outBuffer.Length ; i++ ) {
                Console.WriteLine( outBuffer[i] );
            }
        }
        protected static byte[] UuidStringToBytes(string uuid)
        {
            byte[] returnValue = new byte[16];
            if (uuid.Length == UuidLen)
            {
                int index = 0;
                string hexUuid = String.Join("", uuid.Split('-'));
                for (ushort i = 0; i < hexUuid.Length; i += 2)
                {
                    returnValue[index++] = Convert.ToByte(hexUuid.Substring(i, 2), 16);
                }
            }
            return returnValue;
        }
        protected static byte[] HexStringToBytes( string hex )
        {
            if( (hex.Length % 2) != 0 )
            {
                hex = "0" + hex;
            }
            byte[] returnValue = new byte[ hex.Length / 2 ];
            int index = 0;
            for (int i = 0; i < hex.Length; i += 2)
            {
                returnValue[index++] = Convert.ToByte(hex.Substring(i, 2), 16);
            }
            return returnValue;
        }
    }
}
//char[] outBuffer = hexStr.ToCharArray();
//Console.WriteLine( outBuffer[outBuffer.Length-1] );
//Span<byte> outBuffer = new byte[16];
//byte[] outBuffer = new byte[16];
//byte[] outBuffer = HexStringToBytes( hexStr );
