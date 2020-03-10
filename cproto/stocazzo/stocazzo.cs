async Task Main()
{
    var issuer = "http://pippo.local:3000";
    var httpClient = new HttpClient()
    {
        BaseAddress = new Uri(issuer)
    };
    var discovery = await httpClient.GetAsync(".well-known/openid-configuration");
    var discoveryDocument = JObject.Parse(await discovery.Content.ReadAsStringAsync());
    var result = await httpClient.GetAsync(
        discoveryDocument.Value<string>("jwks_uri")
    );
    var keys = new Microsoft.IdentityModel.Tokens.JsonWebKeySet( // THIS.
        await result.Content.ReadAsStringAsync()
    );
    var token = "eyJ0eXAiOiJqd3QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImcwYzBCekw1b19HU3pmRUJDTTZXU0hsNGdfaGx0Q3g0dmlaem5WNkkzeXMifQ.eyJ1c2VySWQiOiIzNDAiLCJ1c2VyTmFtZSI6Im1haW4iLCJjdXN0b21lcklkIjoiMzM4IiwiY3VzdG9tZXJOYW1lIjoidGVjaGRldjIiLCJjdXN0b21lckZ1bGxOYW1lIjoidGVjaGRldjIiLCJ0dXBsZSI6OCwibG9jYXRpb24iOiJsYSIsImlzcyI6Imh0dHA6Ly9WbGFkaW1pcldvcmtNYWMubG9jYWw6MzAwMCIsImF1ZCI6WyJodHRwczovL3JldmVhbC51cy5mbGVldG1hdGljcy5jb20vcmVzb3VyY2VzIl0sInN1YiI6ImQ2NDM4YmFmLTc2ZGItNDA4Ni1hNWQ5LTM2NTc5MThhYTk5ZCIsImV4cCI6MTU3NDQyNDk1NH0.ra90fFVjxyiXitIUb1rdILCNSv3DMcjSGj3XUcClUCavTViYzdRrQb4Wo_ADHHFBT2MxzP2-rrBOPpg2Vb9Mndx_38B0jNeadJTQUT5rmAVYUKZVGTfqY_DS4s6LQuelUN01LkocXgL3sZVbk5bUf3JunBovoIiKdQ8CwAXe_M3QRaxeDhRd0S40B11bDCt5ufzJhxwh3GLLBcfhhc_dH7JIn5n5qopjzjphytYBtb7ocRUeF35X3RhOx63rgxzUwHkR9kk7n8qHJqU-igLBbbmnbAByiIxr58kJ_NyRR7tncSx5XCQ1EsbnvBipnIn_s-gMMyS_Wi4Dj-UZXm-NhthCw6THKOFCqQXOi5wj_5SQnQu34NxE_G_GVX2PuZYAMesuolpRjn9jm5Yz30hAmdTPamnDN14wqHTKyqOL83jUnC0vyHAQ8d0J_YGyL6W_Fzmp6mZ-y1416XYGeTSp1zUN9ie7zYvyqbUdI77JgSSKyIx18ZUQXQrVHq76OvtmNVqaVlxIwYZ5qGo5FBNo-PC4EnnhnubZXz5-LmQKq6s0ExvCbq2JiS31n3J-JyTq0Dormj16PmiRssPmyL9QT_fWlSPail4FxjPzrEY8lrj7Bi-3xaWaezwNHSFpkp2oos9lq9ait8qfkAS6gBR5EZIW-iC5ClJ-Otjs3xTGpmM";
    //var invalidToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1MzIwOTcyMTgsImV4cCI6MTUzMjEwMDgxOCwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGZhZWI1Mzk0ZDIuZGV2LnVzLmZtLWNsb3VkLmNvbSIsImF1ZCI6WyJodHRwczovL3Rva2VuLnN0c3Y0LjUwZmFlYjUzOTRkMi5kZXYudXMuZm0tY2xvdWQuY29tL3Jlc291cmNlcyIsIm9wZW5pZCJdLCJjbGllbnRfaWQiOiJtYXN0ZXIiLCJzdWIiOiIzYzdlYWQwYi02ZTUzLTQ4ZGQtYTAyNy0wOGQ1ZWjjNmRhODEiLCJhdXRoX3RpbWUiOjE1MzIwOTcyMTgsImlkcCI6ImxvY2FsIiwianRpIjoiYWNhNzdiMGQyNjYxMjUyN2RhM2ZlZGM5NjZhZDZjZjMiLCJzY29wZSI6WyJvcGVuaWQiXSwiYW1yIjpbInB3ZCJdfQ.XhvTiG5A0DeudhyLTrGLr3InZcD59TpQiAQ9Dd71xUHNWFLzc7FK3_-hvxJwXP88qvC7Ct5pD9ljDoXXK72PVUppokCBE0XFJE_xz9-XzO3GPmRUYfNKHxeqGa8AF0xYNekTaAydl58I5zAM8Bwff3Hm_jVgJQ_2NrL_DbSx6-6IDZ1TO856jIICJpDGg1I8r7twwl2ehovZtEe0Y433_i2wfqW8xwRfj7mvJowyWqEB2RS6eM5T9WSoK1l5tgX8YbMPHNMBJPukMgX5S75eG-JfdEZmQ-r1dqaaudhzIAsw9GZqCglgofgiFJp8PM6dTgtbT87Mb8gYRWiLjGI7AtkBkloGWnxLuvGmaoVQH3xZJzSKeYHY9lpCNvV-Ar917ec5Gr6Lw3-r5-49-DvKg2zwUyYrSEXBtSMtIg8cmbTnx3UWqM2FqXDHK8fodsJPQVJeMhnY-56sQTtwrAQIpF1P5-PE84KihBSbnzQXaNIlri1yWLmPxgaubF0TQkbH1a1_s__LGg2Aj9w7ZvxOC2lnqH-8ekJWcV82b8bQZD1S11vi4LjafeGnaC_lYIzXOVvaZtF-0Iy-kQ9n2uX6h-68i00izYZ3ZRRLiCzbZxkiU6s1_hzl6-UxTJtMj42eWPipto_6yWpgPJgXoK9yC1nJ_12CtOrU_YiImFDxCpE";
    var tokenHandler = new JwtSecurityTokenHandler();
    try
    {
        var user = tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
            ValidIssuer = issuer,
            ValidAudiences = new[] { $"https://reveal.us.fleetmatics.com/resources" },
            IssuerSigningKeys = keys.GetSigningKeys()
        }, out var validatedToken);
    }
    catch(SecurityTokenExpiredException e){
        "Expired token".Dump();        
    }
    catch(SecurityTokenInvalidSignatureException e){
        "Invalid token".Dump();
    }
}
// Define other methods and classes here

