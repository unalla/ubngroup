This sample project covers:
<ul>
<li>Hosting S3 Static Website</li>
<li>Creating CloudFront OAC (Origin Access Control or OriginAccess Identity) distribution for the site</li>
<li>Configuring continous deployment from github to S3 Bucket using GitHub Actions</li>
<li>Using API Gateway, DynamoDB and Lambda Function to display the no. of visitors to the site </li>
<li>Using API Gateway and Lambda Function to forward the ContactUs Form details to an email using SES</li>
</ul>

<b>Architecture</b>



![Arch-1](https://user-images.githubusercontent.com/43560747/210120656-4954657c-4e4e-4eab-91db-4818327a6fea.png)



<b>Important:</b>
<p>For CloudFront distribution, after creating CloudFront distribution you must create a bucket policy to give permission to CloudFront </p>

![image](https://user-images.githubusercontent.com/43560747/210114675-dbec2f09-e4b3-406d-95d3-a80bbfd5c954.png)

<p>You have add a yaml config file in sorce folder @ .github/workflows/mail.yml</p>
<p>The contents of the main.yml are as follows</p>

![image](https://user-images.githubusercontent.com/43560747/210115912-ecdf74d0-29f8-4ab0-9ada-b5d05dbdf618.png)

<p>After that, for Continuos Deployment from GitHub to AWS.</p>
<p>Add your AWS Access Key and Secret to your project repo's settings-> secrets</p>

![image](https://user-images.githubusercontent.com/43560747/210114960-0d161c96-b8cf-40c4-9a93-8e6d9af03a29.png)

Vistors lambda function involves getting the Source IP info and store it in DynamoDb table. This lambda function gets the source IP info using Proxy Integration. The thing is that, Proxy integrations cannot be configured to transform responses. Therefore, Apart from enabling CORS on the API Gateway, additionally it is required that we have to manually add the "Allow-Control-Allow-Origin" in our response as shown below

![image](https://user-images.githubusercontent.com/43560747/210115646-5ead0da3-3f29-46c5-84b6-63edc77cca19.png)

For ContactUs to your preferred email. Enable CORS on your API Gateway
![image](https://user-images.githubusercontent.com/43560747/210116299-459ca014-5d7c-4749-99a5-169b6be7c3cb.png)
